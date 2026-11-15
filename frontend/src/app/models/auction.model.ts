export interface Auction {
  id?: number;
  propertyId: number;
  startingPrice: number;
  currentHighestBid?: number;
  highestBidderId?: number;
  highestBidderName?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt?: string;
}

export interface Bid {
  id?: number;
  auctionId: number;
  buyerId: number;
  buyerName?: string;
  bidAmount: number;
  bidTime?: string;
}
