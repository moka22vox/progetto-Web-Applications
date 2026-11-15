package com.realestate.portal.dto;

import java.time.LocalDateTime;

public class FacebookPromotionResponse {
    private boolean success;
    private String postId;
    private String permalinkUrl;
    private String pageName;
    private String message;
    private LocalDateTime publishedAt;

    public FacebookPromotionResponse() {}

    public FacebookPromotionResponse(boolean success, String postId, String permalinkUrl, String pageName, String message, LocalDateTime publishedAt) {
        this.success = success;
        this.postId = postId;
        this.permalinkUrl = permalinkUrl;
        this.pageName = pageName;
        this.message = message;
        this.publishedAt = publishedAt;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }

    public String getPermalinkUrl() { return permalinkUrl; }
    public void setPermalinkUrl(String permalinkUrl) { this.permalinkUrl = permalinkUrl; }

    public String getPageName() { return pageName; }
    public void setPageName(String pageName) { this.pageName = pageName; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
}
