import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-2">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2 fw-bold" routerLink="/">
          <i class="bi bi-houses-fill text-primary fs-3"></i>
          <span>Immobili<span class="text-primary">Italia</span></span>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                <i class="bi bi-grid-fill me-1"></i> Tutti gli Immobili
              </a>
            </li>
            <li class="nav-item" *ngIf="currentUser?.role === 'SELLER' || currentUser?.originalRole === 'SELLER'">
              <a class="nav-link" routerLink="/seller/dashboard" routerLinkActive="active">
                <i class="bi bi-speedometer2 me-1"></i> Dashboard Venditore
              </a>
            </li>
            <li class="nav-item" *ngIf="currentUser?.role === 'SELLER' || currentUser?.role === 'ADMIN'">
              <a class="nav-link text-warning fw-semibold" routerLink="/properties/new">
                <i class="bi bi-plus-circle-fill me-1"></i> Pubblica Annuncio
              </a>
            </li>
            <li class="nav-item" *ngIf="currentUser?.role === 'ADMIN'">
              <a class="nav-link text-info fw-semibold" routerLink="/admin/dashboard" routerLinkActive="active">
                <i class="bi bi-shield-lock-fill me-1"></i> Pannello Amministratore
              </a>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-2">
            <ng-container *ngIf="currentUser; else guestButtons">
              <div class="dropdown">
                <button class="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                  <i class="bi bi-person-circle"></i>
                  <span>{{ currentUser.fullName }}</span>
                  <span class="badge" [ngClass]="{
                    'bg-danger': currentUser.role === 'ADMIN',
                    'bg-warning text-dark': currentUser.role === 'SELLER',
                    'bg-success': currentUser.role === 'BUYER'
                  }">{{ (currentUser.role === 'ADMIN' && currentUser.id !== 1) ? 'ADMIN NOMINATO' : currentUser.role }}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow">
                  <li class="dropdown-header">Accesso come {{ currentUser.email }}</li>
                  <li><hr class="dropdown-divider"></li>
                  <li *ngIf="currentUser.role === 'SELLER' || currentUser.originalRole === 'SELLER'">
                    <a class="dropdown-item" routerLink="/seller/dashboard">
                      <i class="bi bi-briefcase me-2"></i>I miei Annunci & Messaggi
                    </a>
                  </li>
                  <li *ngIf="currentUser.role === 'ADMIN'">
                    <a class="dropdown-item" routerLink="/admin/dashboard">
                      <i class="bi bi-gear-fill me-2"></i>Gestione Utenti & Annunci
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <button class="dropdown-item text-danger" (click)="onLogout()">
                      <i class="bi bi-box-arrow-right me-2"></i>Disconnetti
                    </button>
                  </li>
                </ul>
              </div>
            </ng-container>

            <ng-template #guestButtons>
              <a class="btn btn-outline-light btn-sm px-3" routerLink="/login">
                <i class="bi bi-box-arrow-in-right me-1"></i> Accedi
              </a>
              <a class="btn btn-primary btn-sm px-3" routerLink="/register">
                <i class="bi bi-person-plus-fill me-1"></i> Registrati
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
