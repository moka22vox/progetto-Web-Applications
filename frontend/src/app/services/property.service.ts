import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property, PropertyFilter } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:8080/api/properties';

  constructor(private http: HttpClient) {}

  getProperties(filter?: PropertyFilter): Observable<Property[]> {
    let params = new HttpParams();
    if (filter) {
      if (filter.transactionType && filter.transactionType !== 'ALL') {
        params = params.set('transactionType', filter.transactionType);
      }
      if (filter.categoryId && filter.categoryId > 0) {
        params = params.set('categoryId', filter.categoryId.toString());
      }
      if (filter.minPrice != null) {
        params = params.set('minPrice', filter.minPrice.toString());
      }
      if (filter.maxPrice != null) {
        params = params.set('maxPrice', filter.maxPrice.toString());
      }
      if (filter.minSqm != null) {
        params = params.set('minSqm', filter.minSqm.toString());
      }
      if (filter.maxSqm != null) {
        params = params.set('maxSqm', filter.maxSqm.toString());
      }
      if (filter.city && filter.city.trim() !== '') {
        params = params.set('city', filter.city.trim());
      }
      if (filter.sortBy) {
        params = params.set('sortBy', filter.sortBy);
      }
      if (filter.sortDir) {
        params = params.set('sortDir', filter.sortDir);
      }
    }
    return this.http.get<Property[]>(this.apiUrl, { params });
  }

  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  createProperty(property: Partial<Property>): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, property);
  }

  updateProperty(id: number, property: Partial<Property>): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, property);
  }

  dropPrice(id: number, newPrice: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/price-drop`, { newPrice }, { responseType: 'text' });
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getPropertiesBySeller(sellerId: number): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/seller/${sellerId}`);
  }
}
