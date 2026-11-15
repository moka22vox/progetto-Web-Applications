import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auction, Bid } from '../models/auction.model';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private apiUrl = 'http://localhost:8080/api/auctions';

  constructor(private http: HttpClient) {}

  getAuctionByProperty(propertyId: number): Observable<Auction> {
    return this.http.get<Auction>(`${this.apiUrl}/property/${propertyId}`);
  }

  createAuction(data: { propertyId: number; startingPrice: number; startDate?: string; endDate?: string }): Observable<Auction> {
    return this.http.post<Auction>(this.apiUrl, data);
  }

  placeBid(data: { auctionId: number; buyerId: number; amount: number }): Observable<Bid> {
    return this.http.post<Bid>(`${this.apiUrl}/bid`, data);
  }

  getBids(auctionId: number): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.apiUrl}/${auctionId}/bids`);
  }
}
