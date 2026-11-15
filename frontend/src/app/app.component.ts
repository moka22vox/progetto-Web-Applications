import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <app-navbar></app-navbar>

      <main class="flex-grow-1">
        <router-outlet></router-outlet>
      </main>

      <footer class="bg-dark text-white-50 py-4 mt-5 border-top border-secondary">
        <div class="container">
          <div class="row g-4 align-items-center">
            <div class="col-md-6 text-center text-md-start">
              <h5 class="text-white fw-bold mb-1">
                <i class="bi bi-houses-fill text-primary me-2"></i>Portale Immobiliare
              </h5>
              <p class="small mb-0">
                Piattaforma Web per annunci di affitto e vendita immobili con gestione aste, ribasso prezzi e recensioni verificate.
              </p>
            </div>
            <div class="col-md-6 text-center text-md-end">
              <span class="badge bg-primary me-1">Angular 17</span>
              <span class="badge bg-success me-1">Spring Boot &#64;RestController</span>
              <span class="badge bg-info text-dark me-1">DAO Pattern PostgreSQL</span>
              <span class="badge bg-warning text-dark me-1">Proxy Design Pattern</span>
              <span class="badge bg-secondary me-1">Chart.js</span>
              <span class="badge bg-danger">Google Maps / OSM</span>
            </div>
          </div>
          <hr class="my-3 border-secondary">
          <div class="text-center small text-muted">
            &copy; 2026 Portale Immobiliare - Progetto di Architettura Web & Ingegneria del Software
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {}
