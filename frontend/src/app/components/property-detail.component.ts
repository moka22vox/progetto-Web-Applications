import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../services/property.service';
import { AuthService } from '../services/auth.service';
import { ReviewService } from '../services/review.service';
import { AuctionService } from '../services/auction.service';
import { ContactService } from '../services/contact.service';
import { FacebookService } from '../services/facebook.service';
import { Property } from '../models/property.model';
import { Review } from '../models/review.model';
import { Auction, Bid } from '../models/auction.model';
import { ContactMessage } from '../models/contact.model';
import { FacebookPromotionResponse } from '../models/facebook.model';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-4" *ngIf="property; else loading">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/" class="text-decoration-none">Home</a></li>
          <li class="breadcrumb-item"><span class="text-muted">{{ property.categoryName }}</span></li>
          <li class="breadcrumb-item active text-truncate" style="max-width: 300px;">{{ property.title }}</li>
        </ol>
      </nav>

      <!-- Titolo -->
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
        <div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="badge px-3 py-2 rounded-pill" [ngClass]="property.transactionType === 'SALE' ? 'bg-primary' : 'bg-success'">
              {{ property.transactionType === 'SALE' ? 'In Vendita' : 'In Affitto' }}
            </span>
            <span class="badge bg-secondary px-3 py-2 rounded-pill">
              <i class="bi bi-tag-fill me-1"></i>{{ property.categoryName }}
            </span>
            <span *ngIf="property.hasPriceDrop" class="price-discount-tag">
              <i class="bi bi-fire"></i> PREZZO RIBASSATO
            </span>
            <span *ngIf="auction" class="badge bg-purple text-white px-3 py-2 rounded-pill" style="background-color: #7b2cbf;">
              <i class="bi bi-hammer me-1"></i> ASTA ATTIVA
            </span>
          </div>
          <h2 class="fw-bold mb-1">{{ property.title }}</h2>
          <p class="text-muted mb-0">
            <i class="bi bi-geo-alt-fill text-danger me-1"></i>
            {{ property.address }}, {{ property.city }}
          </p>
        </div>

        <!-- Prezzo -->
        <div class="text-md-end bg-white p-3 rounded-4 shadow-sm border">
          <span class="text-muted small d-block">Prezzo Richiesto</span>
          <div class="d-flex align-items-baseline gap-2 justify-content-md-end">
            <span *ngIf="property.hasPriceDrop" class="price-strikethrough fs-5">
              € {{ property.originalPrice | number:'1.0-0' }}
            </span>
            <span class="fs-2 fw-bold" [ngClass]="property.hasPriceDrop ? 'text-danger' : 'text-primary'">
              € {{ property.currentPrice | number:'1.0-0' }}
            </span>
            <span class="text-muted" *ngIf="property.transactionType === 'RENT'">/mese</span>
          </div>
          <small class="text-success fw-semibold" *ngIf="property.hasPriceDrop">
            Risparmio di € {{ (property.originalPrice - property.currentPrice) | number:'1.0-0' }}!
          </small>
        </div>
      </div>

      <!-- Barra Azioni Speciali -->
      <div class="card bg-light border-0 shadow-sm rounded-4 mb-4" *ngIf="isOwnerOrAdmin()">
        <div class="card-body p-3 d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-dark px-3 py-2">
              <i class="bi bi-person-badge-fill me-1"></i>
              Strumenti {{ isSeller() ? 'Venditore' : 'Amministratore' }}
            </span>
            <span class="text-muted small">Hai accesso ai privilegi di gestione per questo annuncio.</span>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <!-- Modifica Prezzo -->
            <button class="btn btn-warning btn-sm fw-semibold" (click)="openPriceDropModal()">
              <i class="bi bi-tag-fill me-1"></i> Modifica Prezzo
            </button>
            <!-- Creazione Asta -->
            <button class="btn btn-purple btn-sm text-white fw-semibold" style="background-color: #7b2cbf;" (click)="openAuctionModal()" *ngIf="!auction">
              <i class="bi bi-hammer me-1"></i> Apri Asta
            </button>
            <!-- Promozione Facebook -->
            <button class="btn btn-primary btn-sm fw-semibold" (click)="openFacebookModal()">
              <i class="bi bi-facebook me-1"></i> Promuovi su Facebook API
            </button>
            <!-- Modifica / Elimina -->
            <button class="btn btn-danger btn-sm" (click)="deleteProperty()">
              <i class="bi bi-trash3-fill me-1"></i> Elimina
            </button>
          </div>
        </div>
      </div>
      
      <div class="row g-4">
        <!-- Foto e Descrizione -->
        <div class="col-lg-8">
          
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <img [src]="activeImageUrl || property.mainImageUrl" class="img-fluid w-100" style="max-height: 480px; object-fit: cover;" [alt]="property.title">
            <div class="card-footer bg-white p-2 d-flex gap-2 overflow-auto" *ngIf="property.additionalImages && property.additionalImages.length > 0">
              <img [src]="property.mainImageUrl" class="rounded border p-1" style="width: 80px; height: 60px; object-fit: cover; cursor: pointer;"
                   (click)="setActiveImage(property.mainImageUrl)">
              <img *ngFor="let img of property.additionalImages" [src]="img" class="rounded border p-1"
                   style="width: 80px; height: 60px; object-fit: cover; cursor: pointer;"
                   (click)="setActiveImage(img)">
            </div>
          </div>

          <!-- Caratteristiche -->
          <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-3"><i class="bi bi-info-circle text-primary me-2"></i>Caratteristiche dell'Immobile</h5>
              <div class="row g-3 text-center">
                <div class="col-6 col-sm-3">
                  <div class="p-3 bg-light rounded-3">
                    <i class="bi bi-aspect-ratio text-primary fs-3 d-block mb-1"></i>
                    <span class="text-muted small d-block">Superficie</span>
                    <strong class="fs-5">{{ property.squareMeters }} mq</strong>
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="p-3 bg-light rounded-3">
                    <i class="bi bi-door-open text-primary fs-3 d-block mb-1"></i>
                    <span class="text-muted small d-block">Locali</span>
                    <strong class="fs-5">{{ property.rooms || 1 }}</strong>
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="p-3 bg-light rounded-3">
                    <i class="bi bi-droplet text-primary fs-3 d-block mb-1"></i>
                    <span class="text-muted small d-block">Bagni</span>
                    <strong class="fs-5">{{ property.bathrooms || 1 }}</strong>
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="p-3 bg-light rounded-3">
                    <i class="bi bi-calendar-event text-primary fs-3 d-block mb-1"></i>
                    <span class="text-muted small d-block">Pubblicato</span>
                    <strong class="fs-6">{{ property.createdAt | date:'mediumDate' }}</strong>
                  </div>
                </div>
              </div>

              <hr class="my-4">

              <!-- Descrizione -->
              <h5 class="fw-bold mb-3"><i class="bi bi-card-text text-primary me-2"></i>Descrizione</h5>
              <p class="lead fs-6 text-secondary" style="line-height: 1.8; white-space: pre-line;">{{ property.description }}</p>
            </div>
          </div>

          <!-- Posizione -->
          <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0">
                  <i class="bi bi-geo-alt-fill text-danger me-2"></i>Posizione Google Maps / Geocoding
                </h5>
                <span class="badge bg-light text-dark border">
                  Lat: {{ property.latitude | number:'1.4-4' }}, Lon: {{ property.longitude | number:'1.4-4' }}
                </span>
              </div>
              <p class="text-muted small mb-3">
                Indirizzo certificato: <strong>{{ property.address }}, {{ property.city }}</strong>
              </p>
              
              <div class="custom-map-container">
                <iframe
                  width="100%"
                  height="100%"
                  style="border:0"
                  loading="lazy"
                  allowfullscreen
                  [src]="getMapEmbedUrl()">
                </iframe>
              </div>
            </div>
          </div>

          <!-- Recensioni -->
          <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 class="fw-bold mb-1">
                    <i class="bi bi-chat-heart text-danger me-2"></i>Recensioni dei Visitatori
                  </h5>
                  <small class="text-muted">Feedback autentici lasciati da acquirenti che hanno effettuato un sopralluogo</small>
                </div>
                <button class="btn btn-outline-primary btn-sm" (click)="toggleReviewForm()">
                  <i class="bi bi-pencil-square me-1"></i> Scrivi una Recensione
                </button>
              </div>

              <!-- Nuova Recensione -->
              <div class="bg-light p-3 rounded-4 mb-4 border" *ngIf="showReviewForm">
                <h6 class="fw-bold mb-3">Lascia la tua opinione sull'immobile</h6>
                <form (ngSubmit)="submitReview()">
                  <div class="mb-3">
                    <label class="form-label small fw-bold">Valutazione complessiva</label>
                    <div class="d-flex gap-2">
                      <button type="button" *ngFor="let star of [1,2,3,4,5]" class="btn btn-sm"
                              [ngClass]="newReview.rating >= star ? 'btn-warning' : 'btn-outline-secondary'"
                              (click)="newReview.rating = star">
                        <i class="bi bi-star-fill"></i> {{ star }}
                      </button>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label small fw-bold">Il tuo commento</label>
                    <textarea class="form-control" rows="3" [(ngModel)]="newReview.comment" name="comment"
                              placeholder="Descrivi la luminosità, lo stato degli impianti, la vista, il condominio..." required></textarea>
                  </div>

                  <!-- Verifica Visita -->
                  <div class="form-check p-3 bg-white rounded-3 border mb-3">
                    <input class="form-check-input" type="checkbox" id="visitCheck" [(ngModel)]="newReview.hasVisited" name="hasVisited" required>
                    <label class="form-check-label small fw-semibold" for="visitCheck">
                      <i class="bi bi-patch-check-fill text-success me-1"></i>
                      Dichiaro di aver visitato personalmente questo immobile con il venditore/agente immobiliare.
                    </label>
                  </div>

                  <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-secondary btn-sm" (click)="showReviewForm = false">Annulla</button>
                    <button type="submit" class="btn btn-primary btn-sm px-4" [disabled]="!newReview.hasVisited || !newReview.comment">
                      Pubblica Recensione
                    </button>
                  </div>
                </form>
              </div>

              <!-- Lista Recensioni Esistenti -->
              <div *ngIf="reviews.length > 0; else noReviews">
                <div class="border-bottom py-3" *ngFor="let r of reviews">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong class="d-block">{{ r.buyerName || 'Acquirente Verificato' }}</strong>
                      <div class="text-warning small">
                        <i *ngFor="let s of [1,2,3,4,5]" class="bi" [ngClass]="s <= r.rating ? 'bi-star-fill' : 'bi-star'"></i>
                        <span class="ms-1 fw-bold text-dark">{{ r.rating }}/5</span>
                      </div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      
                      <span class="verified-visitor-badge" *ngIf="r.hasVisited">
                        <i class="bi bi-check2-circle"></i> Ha visitato l'immobile
                      </span>
                      
                      <button *ngIf="isAdmin()" class="btn btn-outline-danger btn-sm p-1" (click)="deleteReview(r.id!)" title="Elimina recensione (Admin)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <p class="text-secondary mb-1">{{ r.comment }}</p>
                  <small class="text-muted">{{ r.createdAt | date:'mediumDate' }}</small>
                </div>
              </div>

              <ng-template #noReviews>
                <div class="text-center py-4 text-muted">
                  <i class="bi bi-chat-square-text fs-2 d-block mb-2"></i>
                  Ancora nessuna recensione per questo immobile. Se lo hai visitato, condividi la tua opinione!
                </div>
              </ng-template>
            </div>
          </div>
        </div>

        <!-- Contatto Venditore + Box Asta -->
        <div class="col-lg-4">
          
          <div class="card border-0 shadow-sm rounded-4 mb-4 text-white" style="background: linear-gradient(135deg, #480ca8 0%, #3f37c9 100%);" *ngIf="auction">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="badge bg-warning text-dark fw-bold px-3 py-2">
                  <i class="bi bi-hammer me-1"></i> ASTA LIVE
                </span>
                <span class="small badge bg-white bg-opacity-25">{{ auction.active ? 'In corso' : 'Chiusa' }}</span>
              </div>

              <span class="small opacity-75 d-block">Offerta Corrente Più Alta</span>
              <h3 class="fw-bold mb-2">€ {{ (auction.currentHighestBid || auction.startingPrice) | number:'1.0-0' }}</h3>
              <p class="small opacity-75 mb-3">
                Prezzo base di partenza: € {{ auction.startingPrice | number:'1.0-0' }}<br>
                Termine asta: <strong>{{ auction.endDate | date:'medium' }}</strong>
              </p>
              
              <div class="bg-white text-dark p-3 rounded-3" *ngIf="auction.active">
                <label class="form-label small fw-bold">Piazza un rilancio (€)</label>
                <div class="input-group mb-2">
                  <span class="input-group-text">€</span>
                  <input type="number" class="form-control" [(ngModel)]="bidAmount" [placeholder]="'Min € ' + ((auction.currentHighestBid || auction.startingPrice) + 1000)">
                  <button class="btn btn-warning fw-bold" (click)="placeBid()" [disabled]="!bidAmount">
                    Offri
                  </button>
                </div>
                <small class="text-muted d-block" *ngIf="auction.highestBidderName">
                  Ultima offerta da: <strong>{{ auction.highestBidderName }}</strong>
                </small>
              </div>
            </div>
          </div>

          
          <div class="card border-0 shadow-sm rounded-4 sticky-top" style="top: 85px;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                  <i class="bi bi-person-fill fs-3"></i>
                </div>
                <div>
                  <h6 class="mb-0 fw-bold">{{ property.sellerName || 'Venditore Certificato' }}</h6>
                  <small class="text-muted">Proprietario dell'annuncio</small>
                </div>
              </div>

              <h6 class="fw-bold mb-2">Contatta direttamente il venditore</h6>
              <p class="text-muted small mb-3">Compila il modulo per richiedere informazioni, concordare una visita o formulare una proposta.</p>

              <div *ngIf="contactSuccess" class="alert alert-success d-flex align-items-center">
                <i class="bi bi-check-circle-fill fs-4 me-2"></i>
                <span>Messaggio inviato con successo al venditore!</span>
              </div>

              <form *ngIf="!contactSuccess" (ngSubmit)="sendDirectContact()">
                <!-- Oggetto imposto da specifica: Codice e Titolo -->
                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">Oggetto (Predefinito da Specifica)</label>
                  <input type="text" class="form-control bg-light" [value]="'[ANN-' + property.id + '] ' + property.title" readonly>
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold">Il tuo Nome</label>
                  <input type="text" class="form-control" [(ngModel)]="directContact.buyerName" name="buyerName" required>
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold">Email</label>
                  <input type="email" class="form-control" [(ngModel)]="directContact.buyerEmail" name="buyerEmail" required>
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold">Telefono</label>
                  <input type="text" class="form-control" [(ngModel)]="directContact.buyerPhone" name="buyerPhone">
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold">Messaggio</label>
                  <textarea class="form-control" rows="3" [(ngModel)]="directContact.message" name="message"
                            placeholder="Sono interessato a questo annuncio..." required></textarea>
                </div>

                <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold"
                        [disabled]="!directContact.buyerName || !directContact.buyerEmail || !directContact.message">
                  <i class="bi bi-send-fill me-1"></i> Invia Richiesta al Venditore
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- MODIFICA PREZZO -->
      <div class="modal fade show d-block" tabindex="-1" *ngIf="showPriceDropModal" style="background-color: rgba(0,0,0,0.6);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header bg-warning text-dark rounded-top-4">
              <h5 class="modal-title fw-bold"><i class="bi bi-tag-fill me-2"></i>Modifica Prezzo Annuncio</h5>
              <button type="button" class="btn-close" (click)="showPriceDropModal = false"></button>
            </div>
            <div class="modal-body p-4">
              <p class="text-muted small">
                Prezzo attuale: <strong>€ {{ property.currentPrice | number }}</strong>. In caso di ribasso, il vecchio prezzo rimarrà visibile barrato. In caso di rialzo, il prezzo verrà incrementato.
              </p>
              <div class="mb-3">
                <label class="form-label small fw-bold">Nuovo Prezzo Desiderato (€)</label>
                <div class="input-group">
                  <span class="input-group-text">€</span>
                  <input type="number" class="form-control" [(ngModel)]="newDiscountedPrice" placeholder="Inserisci il nuovo prezzo">
                </div>
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" (click)="showPriceDropModal = false">Annulla</button>
                <button type="button" class="btn btn-warning fw-bold" (click)="executePriceDrop()">Salva Prezzo</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CREA ASTA -->
      <div class="modal fade show d-block" tabindex="-1" *ngIf="showAuctionModal" style="background-color: rgba(0,0,0,0.6);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header text-white rounded-top-4" style="background-color: #7b2cbf;">
              <h5 class="modal-title fw-bold"><i class="bi bi-hammer me-2"></i>Avvia Asta per questo Immobile</h5>
              <button type="button" class="btn-close btn-close-white" (click)="showAuctionModal = false"></button>
            </div>
            <div class="modal-body p-4">
              <div class="mb-3">
                <label class="form-label small fw-bold">Prezzo Base di Partenza (€)</label>
                <input type="number" class="form-control" [(ngModel)]="auctionStartPrice">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Durata dell'Asta (giorni)</label>
                <select class="form-select" [(ngModel)]="auctionDurationDays">
                  <option [ngValue]="3">3 Giorni</option>
                  <option [ngValue]="7">7 Giorni (Consigliato)</option>
                  <option [ngValue]="14">14 Giorni</option>
                  <option [ngValue]="30">30 Giorni</option>
                </select>
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" (click)="showAuctionModal = false">Annulla</button>
                <button type="button" class="btn btn-purple text-white fw-bold" style="background-color: #7b2cbf;" (click)="executeCreateAuction()">
                  Attiva Asta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal fade show d-block" tabindex="-1" *ngIf="showFacebookModal" style="background-color: rgba(0,0,0,0.6);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header bg-primary text-white rounded-top-4">
              <h5 class="modal-title fw-bold"><i class="bi bi-facebook me-2"></i>Promuovi Annuncio su Facebook API</h5>
              <button type="button" class="btn-close btn-close-white" (click)="showFacebookModal = false"></button>
            </div>
            <div class="modal-body p-4">
              <div *ngIf="fbResponse" class="alert alert-success">
                <h6 class="fw-bold"><i class="bi bi-check-circle-fill me-2"></i>{{ fbResponse.message }}</h6>
                <p class="small mb-1">Post ID: <code>{{ fbResponse.postId }}</code></p>
                <p class="small mb-1">Pagina target: <strong>{{ fbResponse.pageName }}</strong></p>
                <a [href]="fbResponse.permalinkUrl" target="_blank" class="btn btn-sm btn-outline-primary mt-2">
                  <i class="bi bi-box-arrow-up-right me-1"></i> Visualizza post su Facebook
                </a>
              </div>

              <div *ngIf="!fbResponse">
                <p class="text-muted small">
                  L'annuncio verrà inviato alla Facebook Graph API (endpoint <code>/v19.0/feed</code>) per essere pubblicato sulla tua Pagina Facebook aziendale.
                </p>
                <div class="mb-3">
                  <label class="form-label small fw-bold">Nome Pagina Facebook</label>
                  <input type="text" class="form-control" [(ngModel)]="fbTargetPage">
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold">Messaggio Personalizzato di Accompagnamento</label>
                  <textarea class="form-control" rows="3" [(ngModel)]="fbCustomMessage"
                            placeholder="Scopri questo splendido immobile appena inserito nel nostro catalogo..."></textarea>
                </div>
                <div class="d-flex justify-content-end gap-2">
                  <button type="button" class="btn btn-secondary" (click)="showFacebookModal = false">Annulla</button>
                  <button type="button" class="btn btn-primary px-4 fw-bold" (click)="executeFacebookPublish()">
                    <i class="bi bi-share-fill me-1"></i> Pubblica Tramite API
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="text-center py-5 my-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="text-muted mt-2">Caricamento dettagli immobile e dati collegati (Proxy Pattern)...</p>
      </div>
    </ng-template>
  `
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  activeImageUrl: string = '';
  reviews: Review[] = [];
  auction: Auction | null = null;

  // Recensioni
  showReviewForm: boolean = false;
  newReview: Partial<Review> = { rating: 5, comment: '', hasVisited: false };

  // Contatto
  directContact: Partial<ContactMessage> = {};
  contactSuccess: boolean = false;

  // Asta
  bidAmount?: number;
  showAuctionModal: boolean = false;
  auctionStartPrice: number = 0;
  auctionDurationDays: number = 7;

  // Ribasso
  showPriceDropModal: boolean = false;
  newDiscountedPrice?: number;

  // Facebook
  showFacebookModal: boolean = false;
  fbTargetPage: string = 'RealEstate Italia - Canale Ufficiale';
  fbCustomMessage: string = '';
  fbResponse: FacebookPromotionResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private authService: AuthService,
    private reviewService: ReviewService,
    private auctionService: AuctionService,
    private contactService: ContactService,
    private facebookService: FacebookService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProperty(id);
    }
  }

  loadProperty(id: number): void {
    this.propertyService.getPropertyById(id).subscribe({
      next: (p) => {
        this.property = p;
        this.activeImageUrl = p.mainImageUrl;
        this.reviews = p.reviews || [];
        this.auction = p.auction || null;
        this.auctionStartPrice = p.currentPrice;

        const user = this.authService.currentUserValue;
        this.directContact = {
          propertyId: p.id,
          sellerId: p.sellerId,
          buyerId: user?.id,
          buyerName: user?.fullName || '',
          buyerEmail: user?.email || '',
          buyerPhone: user?.phone || '',
          message: ''
        };
      },
      error: () => this.router.navigate(['/'])
    });
  }

  readonly mapToken: string = 'pk.eyJ1IjoibG9yZW56b2Jhc2lsZTAwNCIsImEiOiJjbXdjMmxhMGcwMHJ0MnpzODZzeWVtbTJlIn0.Kpba4zbJuQanvkO4UjJRiQ';

  setActiveImage(url: string): void {
    this.activeImageUrl = url;
  }

  getMapEmbedUrl(): string {
    const lat = this.property?.latitude || 41.9028;
    const lon = this.property?.longitude || 12.4964;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.015}%2C${lat - 0.01}%2C${lon + 0.015}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lon}`;
  }

  isOwnerOrAdmin(): boolean {
    const user = this.authService.currentUserValue;
    if (!user || !this.property) return false;
    return user.role === 'ADMIN' || user.id === this.property.sellerId;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isSeller(): boolean {
    return this.authService.isSeller();
  }

  toggleReviewForm(): void {
    if (!this.authService.isAuthenticated()) {
      alert("Per poter scrivere una recensione devi prima effettuare l'accesso!");
      this.router.navigate(['/login']);
      return;
    }
    this.showReviewForm = !this.showReviewForm;
  }

  submitReview(): void {
    if (!this.property) return;
    if (!this.authService.isAuthenticated()) {
      alert("Per poter pubblicare una recensione devi prima effettuare l'accesso!");
      this.router.navigate(['/login']);
      return;
    }
    const user = this.authService.currentUserValue;
    const reviewData: Review = {
      propertyId: this.property.id,
      buyerId: user ? user.id : 3, // fallback test buyer
      rating: this.newReview.rating || 5,
      comment: this.newReview.comment || '',
      hasVisited: this.newReview.hasVisited || false
    };

    this.reviewService.addReview(reviewData).subscribe({
      next: (saved) => {
        this.reviews.unshift(saved);
        this.showReviewForm = false;
        this.newReview = { rating: 5, comment: '', hasVisited: false };
      },
      error: (err) => alert('Errore inserimento recensione: ' + (err.error || err.message))
    });
  }

  deleteReview(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa recensione?')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => this.reviews = this.reviews.filter(r => r.id !== id),
        error: (err) => alert('Errore eliminazione recensione: ' + err.message)
      });
    }
  }

  sendDirectContact(): void {
    if (!this.property) return;
    if (!this.authService.isAuthenticated()) {
      alert("Per poter contattare il venditore devi prima effettuare l'accesso!");
      this.router.navigate(['/login']);
      return;
    }
    const msg: ContactMessage = {
      propertyId: this.property.id,
      sellerId: this.property.sellerId,
      buyerId: this.authService.currentUserValue?.id,
      subject: `[ANN-${this.property.id}] ${this.property.title}`,
      buyerName: this.directContact.buyerName || '',
      buyerEmail: this.directContact.buyerEmail || '',
      buyerPhone: this.directContact.buyerPhone || '',
      message: this.directContact.message || ''
    };

    this.contactService.sendMessage(msg).subscribe({
      next: () => {
        this.contactSuccess = true;
      },
      error: (err) => alert('Errore invio messaggio: ' + err.message)
    });
  }

  // Azioni Asta
  openAuctionModal(): void {
    this.showAuctionModal = true;
  }

  executeCreateAuction(): void {
    if (!this.property) return;
    this.auctionService.createAuction({
      propertyId: this.property.id,
      startingPrice: this.auctionStartPrice
    }).subscribe({
      next: (created) => {
        this.auction = created;
        this.showAuctionModal = false;
      },
      error: (err) => alert('Errore creazione asta: ' + (err.error || err.message))
    });
  }

  placeBid(): void {
    if (!this.auction || !this.bidAmount) return;
    if (!this.authService.isAuthenticated()) {
      alert("Per poter fare un'offerta devi prima effettuare l'accesso!");
      this.router.navigate(['/login']);
      return;
    }
    const user = this.authService.currentUserValue;
    this.auctionService.placeBid({
      auctionId: this.auction.id!,
      buyerId: user ? user.id : 3,
      amount: this.bidAmount
    }).subscribe({
      next: (bid) => {
        if (this.auction) {
          this.auction.currentHighestBid = bid.bidAmount;
          this.auction.highestBidderName = user ? user.fullName : 'Acquirente';
        }
        this.bidAmount = undefined;
        alert('Offerta piazzata con successo!');
      },
      error: (err) => alert('Errore piazzamento offerta: ' + (err.error || err.message))
    });
  }

  //Modifica Prezzo
  openPriceDropModal(): void {
    this.newDiscountedPrice = undefined;
    this.showPriceDropModal = true;
  }

  executePriceDrop(): void {
    if (!this.property || !this.newDiscountedPrice || this.newDiscountedPrice <= 0) {
      alert('Inserisci un importo valido maggiore di zero');
      return;
    }

    const newPrice = this.newDiscountedPrice;
    this.propertyService.dropPrice(this.property.id, newPrice).subscribe({
      next: () => {
        if (this.property) {
          if (newPrice < this.property.currentPrice) {
            // Ribasso: visualizza barrato
            this.property.hasPriceDrop = true;
          } else {
            // Prezzo alzato
            if (newPrice >= this.property.originalPrice) {
              this.property.originalPrice = newPrice;
              this.property.hasPriceDrop = false;
            }
          }
          this.property.currentPrice = newPrice;
        }
        this.showPriceDropModal = false;
      },
      error: (err) => alert('Errore aggiornamento prezzo: ' + (err.error || err.message))
    });
  }

  // Facebook
  openFacebookModal(): void {
    this.fbResponse = null;
    this.showFacebookModal = true;
  }

  executeFacebookPublish(): void {
    if (!this.property) return;
    this.facebookService.publishListing({
      propertyId: this.property.id,
      pageName: this.fbTargetPage,
      customMessage: this.fbCustomMessage
    }).subscribe({
      next: (res) => {
        this.fbResponse = res;
      },
      error: (err) => alert('Errore pubblicazione Facebook: ' + err.message)
    });
  }

  deleteProperty(): void {
    if (!this.property) return;
    if (confirm('Sei sicuro di voler eliminare definitivamente questo annuncio?')) {
      this.propertyService.deleteProperty(this.property.id).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => alert('Errore cancellazione: ' + err.message)
      });
    }
  }
}
