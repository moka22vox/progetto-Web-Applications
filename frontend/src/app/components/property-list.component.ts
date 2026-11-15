import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../services/property.service';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../services/auth.service';
import { ContactService } from '../services/contact.service';
import { Property, PropertyFilter } from '../models/property.model';
import { Category } from '../models/category.model';
import { ContactMessage } from '../models/contact.model';
import { PriceTrendsChartComponent } from './price-trends-chart.component';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PriceTrendsChartComponent],
  templateUrl: './property-list.component.html'
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];
  categories: Category[] = [];
  showChart: boolean = true;

  filter: PropertyFilter = {
    transactionType: 'ALL',
    categoryId: 0,
    city: '',
    minPrice: undefined,
    maxPrice: undefined,
    minSqm: undefined,
    maxSqm: undefined,
    sortBy: 'created_at',
    sortDir: 'DESC'
  };

  sortSelection: string = 'date_desc';

  // Stato Modale Contatto
  selectedPropertyForContact: Property | null = null;
  contactForm: Partial<ContactMessage> = {};
  contactSuccess: boolean = false;

  constructor(
    private propertyService: PropertyService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.applyFilters();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: () => {
        // Fallback categorie se offline
        this.categories = [
          { id: 1, name: 'Appartamenti' },
          { id: 2, name: 'Ville' },
          { id: 3, name: 'Box Auto' },
          { id: 4, name: 'Terreni Edificabili' },
          { id: 5, name: 'Attici' }
        ];
      }
    });
  }

  applyFilters(): void {
    this.propertyService.getProperties(this.filter).subscribe({
      next: (res) => this.properties = res,
      error: (err) => console.error('Errore nel recupero annunci', err)
    });
  }

  setTransactionType(type: string): void {
    this.filter.transactionType = type;
    this.applyFilters();
  }

  onSortChange(): void {
    switch (this.sortSelection) {
      case 'price_asc':
        this.filter.sortBy = 'price';
        this.filter.sortDir = 'ASC';
        break;
      case 'price_desc':
        this.filter.sortBy = 'price';
        this.filter.sortDir = 'DESC';
        break;
      case 'sqm_asc':
        this.filter.sortBy = 'sqm';
        this.filter.sortDir = 'ASC';
        break;
      case 'sqm_desc':
        this.filter.sortBy = 'sqm';
        this.filter.sortDir = 'DESC';
        break;
      case 'price_and_sqm_asc':
        this.filter.sortBy = 'price_and_sqm';
        this.filter.sortDir = 'ASC';
        break;
      default:
        this.filter.sortBy = 'created_at';
        this.filter.sortDir = 'DESC';
    }
    this.applyFilters();
  }

  resetFilters(): void {
    this.filter = {
      transactionType: 'ALL',
      categoryId: 0,
      city: '',
      minPrice: undefined,
      maxPrice: undefined,
      minSqm: undefined,
      maxSqm: undefined,
      sortBy: 'created_at',
      sortDir: 'DESC'
    };
    this.sortSelection = 'date_desc';
    this.applyFilters();
  }

  toggleChart(): void {
    this.showChart = !this.showChart;
  }

  openContactModal(p: Property): void {
    if (!this.authService.isAuthenticated()) {
      alert("Per poter contattare il venditore devi prima effettuare l'accesso!");
      this.router.navigate(['/login']);
      return;
    }
    this.selectedPropertyForContact = p;
    this.contactSuccess = false;
    const currentUser = this.authService.currentUserValue;

    // Requisito: "si aprirà un modulo di contatto avente come oggetto il codice e il titolo dell'annuncio"
    this.contactForm = {
      propertyId: p.id,
      sellerId: p.sellerId,
      buyerId: currentUser ? currentUser.id : undefined,
      subject: `[ANN-${p.id}] ${p.title}`,
      buyerName: currentUser ? currentUser.fullName : '',
      buyerEmail: currentUser ? currentUser.email : '',
      buyerPhone: currentUser?.phone || '',
      message: ''
    };
  }

  closeContactModal(): void {
    this.selectedPropertyForContact = null;
    this.contactSuccess = false;
  }

  sendContactMessage(): void {
    if (!this.selectedPropertyForContact) return;
    this.contactService.sendMessage(this.contactForm as ContactMessage).subscribe({
      next: () => {
        this.contactSuccess = true;
        setTimeout(() => this.closeContactModal(), 2000);
      },
      error: (err) => alert('Errore invio messaggio: ' + err.message)
    });
  }
}
