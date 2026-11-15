package com.realestate.portal.dto;

import java.math.BigDecimal;

public class BidRequest {
    private Long auctionId;
    private Long buyerId;
    private BigDecimal amount;

    public BidRequest() {}

    public Long getAuctionId() { return auctionId; }
    public void setAuctionId(Long auctionId) { this.auctionId = auctionId; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
