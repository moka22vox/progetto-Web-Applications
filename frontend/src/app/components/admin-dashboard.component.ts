import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { PropertyService } from '../services/property.service';
import { User } from '../models/user.model';
import { Property } from '../models/property.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 class="fw-bold mb-1"><i class="bi bi-shield-lock-fill text-danger me-2"></i>Pannello Amministratore</h2>
          <p class="text-muted mb-0">Gestione globale degli utenti, moderazione annunci, concessione ruoli e controllo ban.</p>
        </div>
        <span class="badge bg-danger px-3 py-2 fs-6">Modalità Super-Admin</span>
      </div>
      
      <div class="row g-3 mb-4" *ngIf="stats">
        <div class="col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span class="text-muted small">Totale Immobili</span>
            <h3 class="fw-bold text-primary mb-0">{{ stats.totalProperties }}</h3>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span class="text-muted small">Utenti Registrati</span>
            <h3 class="fw-bold text-success mb-0">{{ stats.totalUsers }}</h3>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span class="text-muted small">Aste Attive</span>
            <h3 class="fw-bold text-warning mb-0">{{ stats.totalActiveAuctions }}</h3>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span class="text-muted small">Recensioni Pubblicate</span>
            <h3 class="fw-bold text-info mb-0">{{ stats.totalReviews }}</h3>
          </div>
        </div>
      </div>

      <!-- Tabella Gestione Utenti -->
      <div class="card border-0 shadow-sm rounded-4 mb-4">
        <div class="card-header bg-white p-4 border-bottom">
          <h5 class="fw-bold mb-0"><i class="bi bi-people-fill text-primary me-2"></i>Gestione Utenti del Sistema</h5>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="ps-4">ID</th>
                <th>Utente</th>
                <th>Email</th>
                <th>Ruolo</th>
                <th>Stato Account</th>
                <th class="text-end pe-4">Azioni Amministrative</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of users">
                <td class="ps-4 fw-bold">#{{ u.id }}</td>
                <td>{{ u.fullName || (u.firstName + ' ' + u.lastName) }}</td>
                <td>{{ u.email }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-danger': u.role === 'ADMIN',
                    'bg-warning text-dark': u.role === 'SELLER',
                    'bg-success': u.role === 'BUYER'
                  }">{{ u.role }}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="u.isBanned ? 'bg-danger' : 'bg-success'">
                    {{ u.isBanned ? 'BANNATO' : 'ATTIVO' }}
                  </span>
                </td>
                <td class="text-end pe-4">
                  <div class="btn-group btn-group-sm">
                    <!-- REQUISITO: Il Super Admin non può essere bannato; opzione unban se bannato -->
                    <span *ngIf="u.id === 1" class="badge bg-secondary py-2 px-2">
                      <i class="bi bi-shield-check me-1"></i>Protetto (Super-Admin)
                    </span>

                    <button *ngIf="u.id !== 1" class="btn"
                            [ngClass]="u.isBanned ? 'btn-success' : 'btn-outline-danger'"
                            (click)="toggleBan(u)" [title]="u.isBanned ? 'Sbanna utente' : 'Banna utente'">
                      <i class="bi" [ngClass]="u.isBanned ? 'bi-check-circle' : 'bi-slash-circle'"></i>
                      {{ u.isBanned ? 'Sbanna (Riabilita)' : 'Banna' }}
                    </button>

                    <!-- Retrocessione Admin -->
                    <button class="btn btn-outline-warning" (click)="demoteAdmin(u)" *ngIf="u.id !== 1 && u.role === 'ADMIN'"
                            title="Retrocedi Admin">
                      <i class="bi bi-arrow-down-left-square"></i> Retrocedi
                    </button>

                    <!-- Nomina -->
                    <button class="btn btn-outline-primary" (click)="promoteToAdmin(u)" *ngIf="u.role !== 'ADMIN'"
                            title="Nomina Amministratore">
                      <i class="bi bi-shield-plus"></i> Nomina Admin
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Moderazione Annunci -->
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-header bg-white p-4 border-bottom">
          <h5 class="fw-bold mb-0"><i class="bi bi-houses-fill text-primary me-2"></i>Tutti gli Annunci (Moderazione Totale)</h5>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="ps-4">ID</th>
                <th>Titolo Annuncio</th>
                <th>Venditore</th>
                <th>Prezzo</th>
                <th>Città</th>
                <th class="text-end pe-4">Azioni Moderazione</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of allProperties">
                <td class="ps-4">#{{ p.id }}</td>
                <td class="fw-semibold">
                  <a [routerLink]="['/properties', p.id]" class="text-decoration-none text-dark">{{ p.title }}</a>
                </td>
                <td>{{ p.sellerName || 'Venditore' + p.sellerId }}</td>
                <td>€ {{ p.currentPrice | number }}</td>
                <td>{{ p.city }}</td>
                <td class="text-end pe-4">
                  <div class="btn-group btn-group-sm">
                    <a [routerLink]="['/properties/edit', p.id]" class="btn btn-outline-secondary">
                      <i class="bi bi-pencil"></i> Modifica
                    </a>
                    <button class="btn btn-danger" (click)="adminDeleteProperty(p.id)">
                      <i class="bi bi-trash"></i> Elimina
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  allProperties: Property[] = [];
  stats: any = null;

  constructor(
    private adminService: AdminService,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.adminService.getAllUsers().subscribe(u => this.users = u);
    this.adminService.getSystemStats().subscribe(s => this.stats = s);
    this.propertyService.getProperties().subscribe(p => this.allProperties = p);
  }

  toggleBan(u: User): void {
    if (u.id === 1 || u.role === 'ADMIN' || u.email === 'superadmin@realestate.it') {
      alert('Operazione non consentita: Il Super Admin / Amministratore non può essere bannato!');
      return;
    }
    const nextBanStatus = !u.isBanned;
    const actionLabel = nextBanStatus ? 'bannare' : 'sbannare / riabilitare';
    if (confirm(`Sei sicuro di voler ${actionLabel} l'utente ${u.email}?`)) {
      this.adminService.toggleBanUser(u.id, nextBanStatus).subscribe({
        next: () => {
          u.isBanned = nextBanStatus;
        },
        error: (err) => alert('Errore: ' + err.message)
      });
    }
  }

  promoteToAdmin(u: User): void {
    if (confirm(`Confermi la nomina dell'utente ${u.email} ad Amministratore?`)) {
      this.adminService.promoteToAdmin(u.id).subscribe({
        next: () => {
          u.role = 'ADMIN';
          alert(`${u.email} è ora un Amministratore del portale!`);
        },
        error: (err) => alert('Errore: ' + err.message)
      });
    }
  }

  demoteAdmin(u: User): void {
    const targetRole = prompt(`A quale ruolo desideri retrocedere ${u.email}? Inserisci SELLER (Venditore) oppure BUYER (Compratore):`, 'BUYER');
    if (!targetRole) return;
    const normalized = targetRole.trim().toUpperCase();
    if (normalized !== 'SELLER' && normalized !== 'BUYER') {
      alert("Ruolo non valido. Deve essere SELLER o BUYER.");
      return;
    }

    this.adminService.demoteAdmin(u.id, normalized).subscribe({
      next: () => {
        u.role = normalized as any;
        alert(`Utente ${u.email} retrocesso con successo a ${normalized === 'SELLER' ? 'Venditore' : 'Compratore'}.`);
      },
      error: (err) => alert('Errore: ' + err.message)
    });
  }

  adminDeleteProperty(id: number): void {
    if (confirm('Sei sicuro di voler cancellare definitivamente questo annuncio?')) {
      this.propertyService.deleteProperty(id).subscribe({
        next: () => {
          this.allProperties = this.allProperties.filter(p => p.id !== id);
          if (this.stats) this.stats.totalProperties -= 1;
        },
        error: (err) => alert('Errore cancellazione: ' + err.message)
      });
    }
  }
}
