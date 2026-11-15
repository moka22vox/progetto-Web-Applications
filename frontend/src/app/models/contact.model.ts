export interface ContactMessage {
  id?: number;
  propertyId: number;
  propertyTitle?: string;
  sellerId: number;
  buyerId?: number;
  subject: string; // Oggetto precompilato con codice e titolo dell'annuncio
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  message: string;
  createdAt?: string;
}
