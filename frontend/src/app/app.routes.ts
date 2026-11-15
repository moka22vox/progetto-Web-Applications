import { Routes } from '@angular/router';
import { PropertyListComponent } from './components/property-list.component';
import { PropertyDetailComponent } from './components/property-detail.component';
import { PropertyFormComponent } from './components/property-form.component';
import { SellerDashboardComponent } from './components/seller-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';

export const routes: Routes = [
  { path: '', component: PropertyListComponent },
  { path: 'properties/new', component: PropertyFormComponent },
  { path: 'properties/edit/:id', component: PropertyFormComponent },
  { path: 'properties/:id', component: PropertyDetailComponent },
  { path: 'seller/dashboard', component: SellerDashboardComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];
