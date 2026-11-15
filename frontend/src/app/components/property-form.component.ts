import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PropertyService } from '../services/property.service';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../services/auth.service';
import { Property } from '../models/property.model';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-9">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-header bg-primary text-white p-4 rounded-top-4">
              <h4 class="fw-bold mb-1">
                <i class="bi bi-house-add-fill me-2"></i>
                {{ isEditMode ? 'Modifica Annuncio Immobiliare' : 'Pubblica un Nuovo Annuncio' }}
              </h4>
              <p class="mb-0 opacity-75 small">Inserisci le informazioni, le foto e la geolocalizzazione per il tuo immobile.</p>
            </div>
            <div class="card-body p-4 p-md-5">
              <form (ngSubmit)="onSubmit()">
                <div class="row g-3">
                  
                  <div class="col-12">
                    <label class="form-label fw-bold">Titolo Annuncio</label>
                    <input type="text" class="form-control" [(ngModel)]="property.title" name="title"
                           placeholder="es. Luminoso Trilocale Ristrutturato con Terrazzo a Roma" required>
                  </div>

                  <!-- Tipologia Transazione -->
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Tipo Transazione</label>
                    <select class="form-select" [(ngModel)]="property.transactionType" name="transactionType" required>
                      <option value="SALE">Vendita</option>
                      <option value="RENT">Affitto</option>
                    </select>
                  </div>

                  <!-- Categoria -->
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Categoria Immobile</label>
                    <select class="form-select" [(ngModel)]="property.categoryId" name="categoryId" required>
                      <option *ngFor="let c of categories" [ngValue]="c.id">{{ c.name }}</option>
                    </select>
                  </div>

                  <!-- Prezzo Richiesto -->
                  <div class="col-md-4">
                    <label class="form-label fw-bold">Prezzo Richiesto (€)</label>
                    <div class="input-group">
                      <span class="input-group-text">€</span>
                      <input type="number" class="form-control" [(ngModel)]="property.currentPrice" name="currentPrice" required>
                    </div>
                  </div>

                  <!-- Metri Quadri -->
                  <div class="col-md-4">
                    <label class="form-label fw-bold">Superficie (mq)</label>
                    <div class="input-group">
                      <input type="number" class="form-control" [(ngModel)]="property.squareMeters" name="squareMeters" required>
                      <span class="input-group-text">mq</span>
                    </div>
                  </div>

                  <!-- Locali e Bagni -->
                  <div class="col-md-2">
                    <label class="form-label fw-bold">Locali</label>
                    <input type="number" class="form-control" [(ngModel)]="property.rooms" name="rooms" min="0">
                  </div>
                  <div class="col-md-2">
                    <label class="form-label fw-bold">Bagni</label>
                    <input type="number" class="form-control" [(ngModel)]="property.bathrooms" name="bathrooms" min="0">
                  </div>

                  <!-- Indirizzo e Città -->
                  <div class="col-md-8">
                    <label class="form-label fw-bold">Indirizzo Completo</label>
                    <input type="text" class="form-control" [(ngModel)]="property.address" name="address"
                           placeholder="es. Via Fonteiana 45" required>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">Città</label>
                    <input type="text" class="form-control" [(ngModel)]="property.city" name="city"
                           placeholder="es. Roma" required>
                  </div>

                  <!-- Coordinate -->
                  <div class="col-md-6">
                    <label class="form-label small fw-bold">Latitudine Google Maps</label>
                    <input type="number" step="0.000001" class="form-control" [(ngModel)]="property.latitude" name="latitude" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-bold">Longitudine Google Maps</label>
                    <input type="number" step="0.000001" class="form-control" [(ngModel)]="property.longitude" name="longitude" required>
                  </div>

                  <!-- URL Foto -->
                  <div class="col-12">
                    <label class="form-label fw-bold">URL Foto Principale</label>
                    <input type="url" class="form-control" [(ngModel)]="property.mainImageUrl" name="mainImageUrl"
                           placeholder="https://images.unsplash.com/photo-..." required>
                  </div>

                  <!-- Descrizione -->
                  <div class="col-12">
                    <label class="form-label fw-bold">Descrizione Dettagliata</label>
                    <textarea class="form-control" rows="5" [(ngModel)]="property.description" name="description"
                              placeholder="Descrivi finiture, esposizione, stato degli impianti, classe energetica, pertinenze..." required></textarea>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <a routerLink="/" class="btn btn-outline-secondary">Annulla</a>
                  <button type="submit" class="btn btn-primary px-5 py-2 fw-semibold">
                    <i class="bi bi-check2-circle me-1"></i>
                    {{ isEditMode ? 'Salva Modifiche' : 'Pubblica Immobile' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PropertyFormComponent implements OnInit {
  isEditMode: boolean = false;
  categories: Category[] = [];

  property: Partial<Property> = {
    title: '',
    transactionType: 'SALE',
    categoryId: 1,
    currentPrice: 250000,
    originalPrice: 250000,
    hasPriceDrop: false,
    squareMeters: 85,
    rooms: 3,
    bathrooms: 2,
    address: 'Via Condotti 10',
    city: 'Roma',
    latitude: 41.9056,
    longitude: 12.4823,
    mainImageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
    description: ''
  };

  constructor(
    private propertyService: PropertyService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(c => this.categories = c);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.propertyService.getPropertyById(Number(id)).subscribe(p => this.property = p);
    }
  }

  onSubmit(): void {
    const user = this.authService.currentUserValue;
    this.property.sellerId = user ? user.id : 2;

    if (this.isEditMode && this.property.id) {
      this.propertyService.updateProperty(this.property.id, this.property).subscribe({
        next: () => this.router.navigate(['/properties', this.property.id]),
        error: (err) => alert('Errore aggiornamento: ' + err.message)
      });
    } else {
      this.propertyService.createProperty(this.property).subscribe({
        next: (saved) => {
          this.resetForm();
          this.router.navigate(['/properties', saved.id]);
        },
        error: (err) => alert('Errore pubblicazione: ' + err.message)
      });
    }
  }

  resetForm(): void {
    this.property = {
      title: '',
      transactionType: 'SALE',
      categoryId: 1,
      currentPrice: 250000,
      originalPrice: 250000,
      hasPriceDrop: false,
      squareMeters: 85,
      rooms: 3,
      bathrooms: 2,
      address: '',
      city: '',
      latitude: 41.9028,
      longitude: 12.4964,
      mainImageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      description: ''
    };
  }
}
