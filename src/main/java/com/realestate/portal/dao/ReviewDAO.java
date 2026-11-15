package com.realestate.portal.dao;

import com.realestate.portal.model.Review;
import java.util.List;
import java.util.Optional;

public interface ReviewDAO {
    List<Review> findByPropertyId(Long propertyId);
    Optional<Review> findById(Long id);
    Review save(Review review);
    boolean delete(Long id);
    List<Review> findAll();
}
