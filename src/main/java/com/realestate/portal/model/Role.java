package com.realestate.portal.model;

public enum Role {
    ADMIN,
    SELLER,
    BUYER;

    public static Role fromString(String roleStr) {
        if (roleStr == null) return BUYER;
        try {
            return Role.valueOf(roleStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return BUYER;
        }
    }
}
