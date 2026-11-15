import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="bg-primary text-white p-4 text-center">
              <i class="bi bi-shield-lock display-4 mb-2 d-block"></i>
              <h3 class="fw-bold mb-1">Accedi al Portale</h3>
              <p class="small opacity-75 mb-0">Gestisci annunci, offerte e recensioni</p>
            </div>
            <div class="card-body p-4 p-md-5">
              <div *ngIf="errorMessage" class="alert alert-danger small py-2">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> {{ errorMessage }}
              </div>

              <!-- Accesso Rapido -->
              <div class="mb-4 p-3 bg-light rounded-3 border">
                <span class="small fw-bold text-muted d-block mb-2">Account di prova (clicca per compilare):</span>
                <div class="d-flex flex-wrap gap-1">
                  <button type="button" class="btn btn-outline-danger btn-sm" (click)="fillDemo('superadmin@realestate.it', 'admin123')">
                    👑 Lorenzo - Super-Admin
                  </button>
                  <button type="button" class="btn btn-outline-warning text-dark btn-sm" (click)="fillDemo('monica.voci@realestate.it', 'seller123')">
                    💼 Monica - Venditore
                  </button>
                  <button type="button" class="btn btn-outline-warning text-dark btn-sm" (click)="fillDemo('luigi.cozza@realestate.it', 'seller123')">
                    💼 Luigi - Venditore
                  </button>
                  <button type="button" class="btn btn-outline-success btn-sm" (click)="fillDemo('gennaro.guarino@email.it', 'buyer123')">
                    🛒 Gennaro - Acquirente
                  </button>
                </div>
              </div>

              <form (ngSubmit)="onLogin()">
                <div class="mb-3">
                  <label class="form-label small fw-bold">Indirizzo Email</label>
                  <input type="email" class="form-control" [(ngModel)]="email" name="email" required>
                </div>

                <div class="mb-4">
                  <label class="form-label small fw-bold">Password</label>
                  <input type="password" class="form-control" [(ngModel)]="password" name="password" required>
                </div>

                <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold" [disabled]="!email || !password || isLoading">
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  Accedi
                </button>
              </form>

              <div class="text-center mt-4 pt-3 border-top">
                <span class="small text-muted">Non hai ancora un account? </span>
                <a routerLink="/register" class="small fw-bold text-decoration-none">Registrati qui</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email: string = 'superadmin@realestate.it';
  password: string = 'admin123';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  fillDemo(e: string, p: string): void {
    this.email = e;
    this.password = p;
    this.errorMessage = '';
  }

  onLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (res.role === 'SELLER') {
          this.router.navigate(['/seller/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error || 'Credenziali non valide o server non raggiungibile.';
      }
    });
  }
}
