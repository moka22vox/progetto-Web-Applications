import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../services/property.service';
import { ContactService } from '../services/contact.service';
import { AuthService } from '../services/auth.service';
import { FacebookService } from '../services/facebook.service';
import { Property } from '../models/property.model';
import { ContactMessage } from '../models/contact.model';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 class="fw-bold mb-1"><i class="bi bi-briefcase-fill text-warning me-2"></i>Dashboard Venditore</h2>
          <p class="text-muted mb-0">Gestisci i tuoi annunci, ribassa i prezzi, attiva aste e consulta i messaggi dei potenziali acquirenti.</p>
        </div>
        <a routerLink="/properties/new" class="btn btn-primary fw-semibold px-4 py-2">
          <i class="bi bi-plus-lg me-1"></i> Nuovo Annuncio
        </a>
      </div>

      <!-- Annunci e Messaggi -->
      <ul class="nav nav-pills mb-4 gap-2">
        <li class="nav-item">
          <button class="nav-link px-4 fw-semibold" [class.active]="activeTab === 'properties'" (click)="activeTab = 'properties'">
            <i class="bi bi-houses me-1"></i> I Miei Annunci ({{ myListings.length }})
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link px-4 fw-semibold" [class.active]="activeTab === 'messages'" (click)="activeTab = 'messages'">
            <i class="bi bi-inbox-fill me-1"></i> Messaggi Ricevuti ({{ receivedMessages.length }})
          </button>
        </li>
      </ul>

      <!-- I Miei Annunci -->
      <div *ngIf="activeTab === 'properties'">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4">Immobile</th>
                  <th>Tipo</th>
                  <th>Prezzo Attuale</th>
                  <th>Superficie</th>
                  <th>Città</th>
                  <th class="text-end pe-4">Azioni Venditore</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of myListings">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3">
                      <img [src]="p.mainImageUrl" class="rounded-3 shadow-sm" style="width: 60px; height: 50px; object-fit: cover;">
                      <div>
                        <a [routerLink]="['/properties', p.id]" class="fw-bold text-decoration-none text-dark">
                          {{ p.title }}
                        </a>
                        <span *ngIf="p.hasPriceDrop" class="badge bg-danger ms-2">Ribassato</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="p.transactionType === 'SALE' ? 'bg-primary' : 'bg-success'">
                      {{ p.transactionType === 'SALE' ? 'Vendita' : 'Affitto' }}
                    </span>
                  </td>
                  <td>
                    <div>
                      <!-- Vecchio prezzo barrato -->
                      <span *ngIf="p.hasPriceDrop" class="price-strikethrough small d-block">
                        € {{ p.originalPrice | number }}
                      </span>
                      <strong [ngClass]="p.hasPriceDrop ? 'text-danger' : 'text-dark'">
                        € {{ p.currentPrice | number }}
                      </strong>
                    </div>
                  </td>
                  <td>{{ p.squareMeters }} mq</td>
                  <td>{{ p.city }}</td>
                  <td class="text-end pe-4">
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-warning" (click)="openQuickPriceDrop(p)" title="Ribassa Prezzo">
                        <i class="bi bi-arrow-down-circle"></i> Ribassa
                      </button>
                      <button class="btn btn-outline-primary" (click)="openQuickFacebook(p)" title="Promuovi su Facebook">
                        <i class="bi bi-facebook"></i>
                      </button>
                      <a [routerLink]="['/properties/edit', p.id]" class="btn btn-outline-secondary" title="Modifica">
                        <i class="bi bi-pencil"></i>
                      </a>
                      <button class="btn btn-outline-danger" (click)="deleteListing(p.id)" title="Elimina">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="myListings.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">
                    Non hai ancora pubblicato nessun annuncio.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Sezione Messaggi Ricevuti -->
      <div *ngIf="activeTab === 'messages'">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-3"><i class="bi bi-envelope-open-text text-primary me-2"></i>Richieste di Contatto Ricevute</h5>
            <div class="list-group list-group-flush" *ngIf="receivedMessages.length > 0; else noMessages">
              <div class="list-group-item p-3 rounded-3 mb-2 border" *ngFor="let m of receivedMessages">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 class="fw-bold text-primary mb-1">{{ m.subject }}</h6>
                    <small class="text-muted">
                      Da: <strong>{{ m.buyerName }}</strong> (<a href="mailto:{{ m.buyerEmail }}">{{ m.buyerEmail }}</a>)
                      <span *ngIf="m.buyerPhone"> - Tel: <strong>{{ m.buyerPhone }}</strong></span>
                    </small>
                  </div>
                  <small class="text-muted">{{ m.createdAt | date:'short' }}</small>
                </div>
                <div class="p-3 bg-light rounded-2 text-secondary mb-2">
                  {{ m.message }}
                </div>
                <div class="text-end">
                  <a [href]="'mailto:' + m.buyerEmail + '?subject=Re: ' + m.subject" class="btn btn-sm btn-primary">
                    <i class="bi bi-reply-fill me-1"></i> Rispondi via Email
                  </a>
                </div>
              </div>
            </div>
            <ng-template #noMessages>
              <div class="text-center py-5 text-muted">
                <i class="bi bi-chat-left-dots fs-1 d-block mb-2"></i>
                Nessun messaggio ricevuto finora per i tuoi annunci.
              </div>
            </ng-template>
          </div>
        </div>
      </div>

      
      <div class="modal fade show d-block" tabindex="-1" *ngIf="selectedPropertyForPriceDrop" style="background-color: rgba(0,0,0,0.6);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header bg-warning text-dark rounded-top-4">
              <h5 class="modal-title fw-bold">Ribasso Prezzo: {{ selectedPropertyForPriceDrop.title }}</h5>
              <button type="button" class="btn-close" (click)="selectedPropertyForPriceDrop = null"></button>
            </div>
            <div class="modal-body p-4">
              <p class="small text-muted">Prezzo corrente: <strong>€ {{ selectedPropertyForPriceDrop.currentPrice | number }}</strong></p>
              <div class="mb-3">
                <label class="form-label small fw-bold">Nuovo Prezzo (€)</label>
                <input type="number" class="form-control" [(ngModel)]="newDropPrice" [placeholder]="'Minore di ' + selectedPropertyForPriceDrop.currentPrice">
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-secondary" (click)="selectedPropertyForPriceDrop = null">Annulla</button>
                <button class="btn btn-warning fw-bold" (click)="confirmQuickPriceDrop()">Applica Ribasso</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SellerDashboardComponent implements OnInit {
  activeTab: 'properties' | 'messages' = 'properties';
  myListings: Property[] = [];
  receivedMessages: ContactMessage[] = [];

  selectedPropertyForPriceDrop: Property | null = null;
  newDropPrice?: number;

  constructor(
    private propertyService: PropertyService,
    private contactService: ContactService,
    private authService: AuthService,
    private facebookService: FacebookService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    const sellerId = user ? user.id : 2;

    this.propertyService.getPropertiesBySeller(sellerId).subscribe(list => this.myListings = list);
    this.contactService.getSellerMessages(sellerId).subscribe(msgs => this.receivedMessages = msgs);
  }

  openQuickPriceDrop(p: Property): void {
    this.selectedPropertyForPriceDrop = p;
    this.newDropPrice = undefined;
  }

  confirmQuickPriceDrop(): void {
    if (!this.selectedPropertyForPriceDrop || !this.newDropPrice || this.newDropPrice <= 0) return;
    const newPrice = this.newDropPrice;
    this.propertyService.dropPrice(this.selectedPropertyForPriceDrop.id, newPrice).subscribe({
      next: () => {
        if (newPrice < this.selectedPropertyForPriceDrop!.currentPrice) {
          this.selectedPropertyForPriceDrop!.hasPriceDrop = true;
        } else {
          if (newPrice >= this.selectedPropertyForPriceDrop!.originalPrice) {
            this.selectedPropertyForPriceDrop!.originalPrice = newPrice;
            this.selectedPropertyForPriceDrop!.hasPriceDrop = false;
          }
        }
        this.selectedPropertyForPriceDrop!.currentPrice = newPrice;
        this.selectedPropertyForPriceDrop = null;
      },
      error: (err) => alert('Errore: ' + err.message)
    });
  }

  openQuickFacebook(p: Property): void {
    const page = 'RealEstate Italia - Canale Ufficiale';
    this.facebookService.publishListing({
      propertyId: p.id,
      pageName: page,
      customMessage: `Annuncio in evidenza: ${p.title} a soli € ${p.currentPrice}!`
    }).subscribe({
      next: (res) => alert(`Post pubblicato su Facebook con successo! Post ID: ${res.postId}`),
      error: (err) => alert('Errore Facebook API: ' + err.message)
    });
  }

  deleteListing(id: number): void {
    if (confirm('Eliminare questo annuncio?')) {
      this.propertyService.deleteProperty(id).subscribe({
        next: () => this.myListings = this.myListings.filter(p => p.id !== id),
        error: (err) => alert('Errore: ' + err.message)
      });
    }
  }
}
