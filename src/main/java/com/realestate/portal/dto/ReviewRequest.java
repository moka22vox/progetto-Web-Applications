package com.realestate.portal.dto;

public class ReviewRequest {
    private Long propertyId;
    private Long buyerId;
    private int rating;
    private String comment;
    private boolean hasVisited; // Obbligatorio per verificare che abbia visitato l'immobile

    public ReviewRequest() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public boolean isHasVisited() { return hasVisited; }
    public void setHasVisited(boolean hasVisited) { this.hasVisited = hasVisited; }
}
