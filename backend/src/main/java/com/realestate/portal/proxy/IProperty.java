package com.realestate.portal.proxy;

import com.realestate.portal.model.Auction;
import com.realestate.portal.model.Review;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface IProperty {
    Long getId();
    void setId(Long id);

    Long getSellerId();
    void setSellerId(Long sellerId);

    String getSellerName();
    void setSellerName(String sellerName);

    Long getCategoryId();
    void setCategoryId(Long categoryId);

    String getCategoryName();
    void setCategoryName(String categoryName);

    String getTitle();
    void setTitle(String title);

    String getDescription();
    void setDescription(String description);

    String getTransactionType(); // SALE o RENT
    void setTransactionType(String transactionType);

    BigDecimal getOriginalPrice();
    void setOriginalPrice(BigDecimal originalPrice);

    BigDecimal getCurrentPrice();
    void setCurrentPrice(BigDecimal currentPrice);

    boolean isHasPriceDrop();
    void setHasPriceDrop(boolean hasPriceDrop);

    int getSquareMeters();
    void setSquareMeters(int squareMeters);

    int getRooms();
    void setRooms(int rooms);

    int getBathrooms();
    void setBathrooms(int bathrooms);

    String getAddress();
    void setAddress(String address);

    String getCity();
    void setCity(String city);

    Double getLatitude();
    void setLatitude(Double latitude);

    Double getLongitude();
    void setLongitude(Double longitude);

    String getMainImageUrl();
    void setMainImageUrl(String mainImageUrl);

    LocalDateTime getCreatedAt();
    void setCreatedAt(LocalDateTime createdAt);

    LocalDateTime getUpdatedAt();
    void setUpdatedAt(LocalDateTime updatedAt);


    List<Review> getReviews();
    void setReviews(List<Review> reviews);

    List<String> getAdditionalImages();
    void setAdditionalImages(List<String> additionalImages);

    Auction getAuction();
    void setAuction(Auction auction);

    Double getAverageRating();
    int getReviewsCount();
}
