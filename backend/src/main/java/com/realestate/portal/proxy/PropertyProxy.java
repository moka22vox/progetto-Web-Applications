package com.realestate.portal.proxy;

import com.realestate.portal.dao.AuctionDAO;
import com.realestate.portal.dao.PropertyDAO;
import com.realestate.portal.dao.ReviewDAO;
import com.realestate.portal.model.Auction;
import com.realestate.portal.model.Review;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


public class PropertyProxy implements IProperty {

    private final RealProperty realProperty;
    private final ReviewDAO reviewDAO;
    private final PropertyDAO propertyDAO;
    private final AuctionDAO auctionDAO;

    private boolean reviewsLoaded = false;
    private boolean imagesLoaded = false;
    private boolean auctionLoaded = false;

    public PropertyProxy(RealProperty realProperty, ReviewDAO reviewDAO, PropertyDAO propertyDAO, AuctionDAO auctionDAO) {
        this.realProperty = realProperty != null ? realProperty : new RealProperty();
        this.reviewDAO = reviewDAO;
        this.propertyDAO = propertyDAO;
        this.auctionDAO = auctionDAO;
    }


    @Override
    public List<Review> getReviews() {
        if (!reviewsLoaded && reviewDAO != null && getId() != null) {
            System.out.println("[PROXY PATTERN - VIRTUAL PROXY] Lazy Loading 1-to-N: Caricamento Recensioni per Immobile ID = " + getId());
            List<Review> loadedReviews = reviewDAO.findByPropertyId(getId());
            realProperty.setReviews(loadedReviews);
            this.reviewsLoaded = true;
        }
        return realProperty.getReviews();
    }


    @Override
    public List<String> getAdditionalImages() {
        if (!imagesLoaded && propertyDAO != null && getId() != null) {
            System.out.println("[PROXY PATTERN - VIRTUAL PROXY] Lazy Loading 1-to-N: Caricamento Immagini Accessorie per Immobile ID = " + getId());
            List<String> loadedImages = propertyDAO.findImagesByPropertyId(getId());
            realProperty.setAdditionalImages(loadedImages);
            this.imagesLoaded = true;
        }
        return realProperty.getAdditionalImages();
    }


    @Override
    public Auction getAuction() {
        if (!auctionLoaded && auctionDAO != null && getId() != null) {
            System.out.println("[PROXY PATTERN - VIRTUAL PROXY] Lazy Loading: Caricamento Dati Asta per Immobile ID = " + getId());
            Auction loadedAuction = auctionDAO.findByPropertyId(getId()).orElse(null);
            realProperty.setAuction(loadedAuction);
            this.auctionLoaded = true;
        }
        return realProperty.getAuction();
    }


    @Override public Long getId() { return realProperty.getId(); }
    @Override public void setId(Long id) { realProperty.setId(id); }

    @Override public Long getSellerId() { return realProperty.getSellerId(); }
    @Override public void setSellerId(Long sellerId) { realProperty.setSellerId(sellerId); }

    @Override public String getSellerName() { return realProperty.getSellerName(); }
    @Override public void setSellerName(String sellerName) { realProperty.setSellerName(sellerName); }

    @Override public Long getCategoryId() { return realProperty.getCategoryId(); }
    @Override public void setCategoryId(Long categoryId) { realProperty.setCategoryId(categoryId); }

    @Override public String getCategoryName() { return realProperty.getCategoryName(); }
    @Override public void setCategoryName(String categoryName) { realProperty.setCategoryName(categoryName); }

    @Override public String getTitle() { return realProperty.getTitle(); }
    @Override public void setTitle(String title) { realProperty.setTitle(title); }

    @Override public String getDescription() { return realProperty.getDescription(); }
    @Override public void setDescription(String description) { realProperty.setDescription(description); }

    @Override public String getTransactionType() { return realProperty.getTransactionType(); }
    @Override public void setTransactionType(String transactionType) { realProperty.setTransactionType(transactionType); }

    @Override public BigDecimal getOriginalPrice() { return realProperty.getOriginalPrice(); }
    @Override public void setOriginalPrice(BigDecimal originalPrice) { realProperty.setOriginalPrice(originalPrice); }

    @Override public BigDecimal getCurrentPrice() { return realProperty.getCurrentPrice(); }
    @Override public void setCurrentPrice(BigDecimal currentPrice) { realProperty.setCurrentPrice(currentPrice); }

    @Override public boolean isHasPriceDrop() { return realProperty.isHasPriceDrop(); }
    @Override public void setHasPriceDrop(boolean hasPriceDrop) { realProperty.setHasPriceDrop(hasPriceDrop); }

    @Override public int getSquareMeters() { return realProperty.getSquareMeters(); }
    @Override public void setSquareMeters(int squareMeters) { realProperty.setSquareMeters(squareMeters); }

    @Override public int getRooms() { return realProperty.getRooms(); }
    @Override public void setRooms(int rooms) { realProperty.setRooms(rooms); }

    @Override public int getBathrooms() { return realProperty.getBathrooms(); }
    @Override public void setBathrooms(int bathrooms) { realProperty.setBathrooms(bathrooms); }

    @Override public String getAddress() { return realProperty.getAddress(); }
    @Override public void setAddress(String address) { realProperty.setAddress(address); }

    @Override public String getCity() { return realProperty.getCity(); }
    @Override public void setCity(String city) { realProperty.setCity(city); }

    @Override public Double getLatitude() { return realProperty.getLatitude(); }
    @Override public void setLatitude(Double latitude) { realProperty.setLatitude(latitude); }

    @Override public Double getLongitude() { return realProperty.getLongitude(); }
    @Override public void setLongitude(Double longitude) { realProperty.setLongitude(longitude); }

    @Override public String getMainImageUrl() { return realProperty.getMainImageUrl(); }
    @Override public void setMainImageUrl(String mainImageUrl) { realProperty.setMainImageUrl(mainImageUrl); }

    @Override public LocalDateTime getCreatedAt() { return realProperty.getCreatedAt(); }
    @Override public void setCreatedAt(LocalDateTime createdAt) { realProperty.setCreatedAt(createdAt); }

    @Override public LocalDateTime getUpdatedAt() { return realProperty.getUpdatedAt(); }
    @Override public void setUpdatedAt(LocalDateTime updatedAt) { realProperty.setUpdatedAt(updatedAt); }

    @Override public void setReviews(List<Review> reviews) {
        realProperty.setReviews(reviews);
        this.reviewsLoaded = true;
    }

    @Override public void setAdditionalImages(List<String> additionalImages) {
        realProperty.setAdditionalImages(additionalImages);
        this.imagesLoaded = true;
    }

    @Override public void setAuction(Auction auction) {
        realProperty.setAuction(auction);
        this.auctionLoaded = true;
    }

    @Override
    public Double getAverageRating() {

        getReviews();
        return realProperty.getAverageRating();
    }

    @Override
    public int getReviewsCount() {

        getReviews();
        return realProperty.getReviewsCount();
    }

    public boolean isReviewsLoaded() { return reviewsLoaded; }
    public boolean isImagesLoaded() { return imagesLoaded; }
    public boolean isAuctionLoaded() { return auctionLoaded; }
    public RealProperty getRealProperty() { return realProperty; }
}
