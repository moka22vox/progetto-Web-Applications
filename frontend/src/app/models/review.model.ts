export interface Review {
  id?: number;
  propertyId: number;
  buyerId: number;
  buyerName?: string;
  rating: number; // 1 - 5
  comment: string;
  hasVisited: boolean; // Requisito: solo acquirenti che hanno visitato l'immobile
  createdAt?: string;
}
