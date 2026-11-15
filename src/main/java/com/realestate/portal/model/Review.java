package com.realestate.portal.model;

import java.time.LocalDateTime;

public class Review {
    private Long id;
    private Long propertyId;
    private Long buyerId;
    private String buyerName;
    private int rating;
    private String comment;
    private boolean hasVisited;
    private LocalDateTime createdAt;

    public Review() {}

    public Review(Long id, Long propertyId, Long buyerId, String buyerName, int rating, String comment, boolean hasVisited, LocalDateTime createdAt) {
        this.id = id;
        this.propertyId = propertyId;
        this.buyerId = buyerId;
        this.buyerName = buyerName;
        this.rating = rating;
        this.comment = comment;
        this.hasVisited = hasVisited;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public boolean isHasVisited() { return hasVisited; }
    public void setHasVisited(boolean hasVisited) { this.hasVisited = hasVisited; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
