import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacebookPromotionRequest, FacebookPromotionResponse } from '../models/facebook.model';

@Injectable({
  providedIn: 'root'
})
export class FacebookService {
  private apiUrl = 'http://localhost:8080/api/facebook';

  constructor(private http: HttpClient) {}

  publishListing(request: FacebookPromotionRequest): Observable<FacebookPromotionResponse> {
    return this.http.post<FacebookPromotionResponse>(`${this.apiUrl}/publish`, request);
  }
}
