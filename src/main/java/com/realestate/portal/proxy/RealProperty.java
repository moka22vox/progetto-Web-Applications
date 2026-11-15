package com.realestate.portal.proxy;

import com.realestate.portal.model.Auction;
import com.realestate.portal.model.Review;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Oggetto Reale (Real Subject nel pattern Proxy).
 * Rappresenta l'annuncio immobiliare con i suoi attributi concreti.
 */
public class RealProperty implements IProperty {
    private Long id;
    private Long sellerId;
    private String sellerName;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private String transactionType; // 'SALE' o 'RENT'
    private BigDecimal originalPrice;
    private BigDecimal currentPrice;
    private boolean hasPriceDrop;
    private int squareMeters;
    private int rooms;
    private int bathrooms;
    private String address;
    private String city;
    private Double latitude;
    private Double longitude;
    private String mainImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Relazioni Uno a Molti
    private List<Review> reviews = new ArrayList<>();
    private List<String> additionalImages = new ArrayList<>();
    private Auction auction;

    public RealProperty() {}

    @Override public Long getId() { return id; }
    @Override public void setId(Long id) { this.id = id; }

    @Override public Long getSellerId() { return sellerId; }
    @Override public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    @Override public String getSellerName() { return sellerName; }
    @Override public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    @Override public Long getCategoryId() { return categoryId; }
    @Override public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    @Override public String getCategoryName() { return categoryName; }
    @Override public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    @Override public String getTitle() { return title; }
    @Override public void setTitle(String title) { this.title = title; }

    @Override public String getDescription() { return description; }
    @Override public void setDescription(String description) { this.description = description; }

    @Override public String getTransactionType() { return transactionType; }
    @Override public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    @Override public BigDecimal getOriginalPrice() { return originalPrice; }
    @Override public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    @Override public BigDecimal getCurrentPrice() { return currentPrice; }
    @Override public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    @Override public boolean isHasPriceDrop() { return hasPriceDrop; }
    @Override public void setHasPriceDrop(boolean hasPriceDrop) { this.hasPriceDrop = hasPriceDrop; }

    @Override public int getSquareMeters() { return squareMeters; }
    @Override public void setSquareMeters(int squareMeters) { this.squareMeters = squareMeters; }

    @Override public int getRooms() { return rooms; }
    @Override public void setRooms(int rooms) { this.rooms = rooms; }

    @Override public int getBathrooms() { return bathrooms; }
    @Override public void setBathrooms(int bathrooms) { this.bathrooms = bathrooms; }

    @Override public String getAddress() { return address; }
    @Override public void setAddress(String address) { this.address = address; }

    @Override public String getCity() { return city; }
    @Override public void setCity(String city) { this.city = city; }

    @Override public Double getLatitude() { return latitude; }
    @Override public void setLatitude(Double latitude) { this.latitude = latitude; }

    @Override public Double getLongitude() { return longitude; }
    @Override public void setLongitude(Double longitude) { this.longitude = longitude; }

    @Override public String getMainImageUrl() { return mainImageUrl; }
    @Override public void setMainImageUrl(String mainImageUrl) { this.mainImageUrl = mainImageUrl; }

    @Override public LocalDateTime getCreatedAt() { return createdAt; }
    @Override public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override public LocalDateTime getUpdatedAt() { return updatedAt; }
    @Override public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override public List<Review> getReviews() { return reviews; }
    @Override public void setReviews(List<Review> reviews) { this.reviews = reviews; }

    @Override public List<String> getAdditionalImages() { return additionalImages; }
    @Override public void setAdditionalImages(List<String> additionalImages) { this.additionalImages = additionalImages; }

    @Override public Auction getAuction() { return auction; }
    @Override public void setAuction(Auction auction) { this.auction = auction; }

    @Override
    public Double getAverageRating() {
        if (reviews == null || reviews.isEmpty()) return 0.0;
        double sum = 0;
        for (Review r : reviews) {
            sum += r.getRating();
        }
        return Math.round((sum / reviews.size()) * 10.0) / 10.0;
    }

    @Override
    public int getReviewsCount() {
        return reviews != null ? reviews.size() : 0;
    }
}
