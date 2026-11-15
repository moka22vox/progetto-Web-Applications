package com.realestate.portal.controller;

import com.realestate.portal.dao.ReviewDAO;
import com.realestate.portal.dto.ReviewRequest;
import com.realestate.portal.model.Review;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewDAO reviewDAO;

    public ReviewController(ReviewDAO reviewDAO) {
        this.reviewDAO = reviewDAO;
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Review>> getReviewsByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(reviewDAO.findByPropertyId(propertyId));
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest request) {
        if (!request.isHasVisited()) {
            return ResponseEntity.badRequest().body("È possibile recensire un immobile soltanto dopo aver effettuato una visita.");
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            return ResponseEntity.badRequest().body("Il voto della recensione deve essere compreso tra 1 e 5 stelle.");
        }

        Review review = new Review();
        review.setPropertyId(request.getPropertyId());
        review.setBuyerId(request.getBuyerId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setHasVisited(true);

        Review saved = reviewDAO.save(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        boolean deleted = reviewDAO.delete(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
