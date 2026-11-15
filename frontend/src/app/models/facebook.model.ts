export interface FacebookPromotionRequest {
  propertyId: number;
  pageName?: string;
  customMessage?: string;
}

export interface FacebookPromotionResponse {
  success: boolean;
  postId: string;
  permalinkUrl: string;
  pageName: string;
  message: string;
  publishedAt: string;
}
