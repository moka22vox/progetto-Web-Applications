package com.realestate.portal.dao;

import com.realestate.portal.model.Property;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PropertyDAO {
    Optional<Property> findById(Long id);
    List<Property> findAllFiltered(
        String transactionType,
        Long categoryId,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Integer minSqm,
        Integer maxSqm,
        String city,
        String sortBy,
        String sortDir
    );
    List<Property> findBySellerId(Long sellerId);
    Property save(Property property);
    boolean update(Property property);
    boolean updatePriceDrop(Long propertyId, BigDecimal newPrice);
    boolean updatePrice(Long propertyId, BigDecimal newPrice, boolean hasPriceDrop, BigDecimal originalPrice);
    boolean delete(Long id);
    List<String> findImagesByPropertyId(Long propertyId);
    void addImage(Long propertyId, String imageUrl);
    void deleteImagesByPropertyId(Long propertyId);
}
