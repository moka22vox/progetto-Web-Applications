import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-7 col-lg-6">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="bg-primary text-white p-4 text-center">
              <i class="bi bi-person-plus-fill display-4 mb-2 d-block"></i>
              <h3 class="fw-bold mb-1">Crea un Nuovo Account</h3>
              <p class="small opacity-75 mb-0">Requisito: "Tutti gli utenti possono registrarsi"</p>
            </div>
            <div class="card-body p-4 p-md-5">
              <div *ngIf="errorMessage" class="alert alert-danger small py-2">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> {{ errorMessage }}
              </div>

              <form (ngSubmit)="onRegister()">
                <div class="row g-2 mb-3">
                  <div class="col-sm-6">
                    <label class="form-label small fw-bold">Nome</label>
                    <input type="text" class="form-control" [(ngModel)]="form.firstName" name="firstName" required>
                  </div>
                  <div class="col-sm-6">
                    <label class="form-label small fw-bold">Cognome</label>
                    <input type="text" class="form-control" [(ngModel)]="form.lastName" name="lastName" required>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold">Indirizzo Email</label>
                  <input type="email" class="form-control" [(ngModel)]="form.email" name="email" required>
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold">Telefono</label>
                  <input type="tel" class="form-control" [(ngModel)]="form.phone" name="phone" placeholder="+39 333 1234567">
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold">Password</label>
                  <input type="password" class="form-control" [(ngModel)]="form.password" name="password" required>
                </div>

                <!-- Selezione Ruolo -->
                <div class="mb-4">
                  <label class="form-label small fw-bold d-block mb-2">Tipologia di Utente</label>
                  <div class="row g-2">
                    <div class="col-6">
                      <div class="card p-3 text-center border-2 cursor-pointer"
                           [class.border-primary]="form.role === 'BUYER'"
                           (click)="form.role = 'BUYER'">
                        <i class="bi bi-cart-check-fill fs-3 text-primary d-block mb-1"></i>
                        <span class="fw-bold small">Acquirente</span>
                        <small class="text-muted d-block" style="font-size: 0.72rem;">Cerca, recensisce e contatta</small>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="card p-3 text-center border-2 cursor-pointer"
                           [class.border-warning]="form.role === 'SELLER'"
                           (click)="form.role = 'SELLER'">
                        <i class="bi bi-briefcase-fill fs-3 text-warning d-block mb-1"></i>
                        <span class="fw-bold small">Venditore</span>
                        <small class="text-muted d-block" style="font-size: 0.72rem;">Pubblica, ribassa prezzi, aste</small>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold"
                        [disabled]="!form.firstName || !form.lastName || !form.email || !form.password || isLoading">
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  Completa Registrazione
                </button>
              </form>

              <div class="text-center mt-4 pt-3 border-top">
                <span class="small text-muted">Hai già un account? </span>
                <a routerLink="/login" class="small fw-bold text-decoration-none">Accedi qui</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'BUYER'
  };
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.form).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.role === 'SELLER') {
          this.router.navigate(['/seller/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error || 'Errore durante la registrazione.';
      }
    });
  }
}
