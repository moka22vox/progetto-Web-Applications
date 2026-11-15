package com.realestate.portal.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AuctionRequest {
    private Long propertyId;
    private BigDecimal startingPrice;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public AuctionRequest() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public BigDecimal getStartingPrice() { return startingPrice; }
    public void setStartingPrice(BigDecimal startingPrice) { this.startingPrice = startingPrice; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
}
