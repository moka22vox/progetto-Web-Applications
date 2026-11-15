package com.realestate.portal.dto;

import java.math.BigDecimal;

public class PriceDropRequest {
    private BigDecimal newPrice;

    public PriceDropRequest() {}
    public PriceDropRequest(BigDecimal newPrice) { this.newPrice = newPrice; }

    public BigDecimal getNewPrice() { return newPrice; }
    public void setNewPrice(BigDecimal newPrice) { this.newPrice = newPrice; }
}
