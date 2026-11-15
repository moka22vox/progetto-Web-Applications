package com.realestate.portal.dto;

public class FacebookPromotionRequest {
    private Long propertyId;
    private String pageName;
    private String customMessage;

    public FacebookPromotionRequest() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getPageName() { return pageName; }
    public void setPageName(String pageName) { this.pageName = pageName; }

    public String getCustomMessage() { return customMessage; }
    public void setCustomMessage(String customMessage) { this.customMessage = customMessage; }
}
