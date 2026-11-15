import { Review } from './review.model';
import { Auction } from './auction.model';

export type TransactionType = 'SALE' | 'RENT';

export interface Property {
  id: number;
  sellerId: number;
  sellerName?: string;
  categoryId: number;
  categoryName?: string;
  title: string;
  description: string;
  transactionType: TransactionType;
  originalPrice: number;
  currentPrice: number;
  hasPriceDrop: boolean;
  squareMeters: number;
  rooms: number;
  bathrooms: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  mainImageUrl: string;
  additionalImages?: string[];
  reviews?: Review[];
  auction?: Auction;
  averageRating?: number;
  reviewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyFilter {
  transactionType?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  minSqm?: number;
  maxSqm?: number;
  city?: string;
  sortBy?: 'created_at' | 'price' | 'sqm' | 'price_and_sqm';
  sortDir?: 'ASC' | 'DESC';
}
