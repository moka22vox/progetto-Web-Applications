package com.realestate.portal.controller;

import com.realestate.portal.dao.PropertyDAO;
import com.realestate.portal.dto.PriceDropRequest;
import com.realestate.portal.model.Property;
import com.realestate.portal.proxy.IProperty;
import com.realestate.portal.service.PropertyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

    private final PropertyDAO propertyDAO;
    private final PropertyService propertyService;

    public PropertyController(PropertyDAO propertyDAO, PropertyService propertyService) {
        this.propertyDAO = propertyDAO;
        this.propertyService = propertyService;
    }

    @GetMapping
    public ResponseEntity<List<Property>> searchProperties(
            @RequestParam(required = false) String transactionType,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minSqm,
            @RequestParam(required = false) Integer maxSqm,
            @RequestParam(required = false) String city,
            @RequestParam(required = false, defaultValue = "created_at") String sortBy,
            @RequestParam(required = false, defaultValue = "DESC") String sortDir
    ) {
        List<Property> properties = propertyService.searchProperties(
                transactionType, categoryId, minPrice, maxPrice, minSqm, maxSqm, city, sortBy, sortDir
        );
        return ResponseEntity.ok(properties);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getPropertyById(@PathVariable Long id) {
        Optional<IProperty> propertyProxyOpt = propertyService.getPropertyWithProxy(id);
        if (propertyProxyOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        IProperty proxy = propertyProxyOpt.get();
        proxy.getReviews();
        proxy.getAdditionalImages();
        proxy.getAuction();

        return ResponseEntity.ok(proxy);
    }

    @PostMapping
    public ResponseEntity<Property> createProperty(@RequestBody Property property) {

        if (property.getOriginalPrice() == null) {
            property.setOriginalPrice(property.getCurrentPrice());
        }
        Property saved = propertyDAO.save(property);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProperty(@PathVariable Long id, @RequestBody Property property) {
        property.setId(id);
        boolean updated = propertyDAO.update(property);
        if (!updated) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(property);
    }

    @PatchMapping("/{id}/price-drop")
    public ResponseEntity<?> dropPrice(@PathVariable Long id, @RequestBody PriceDropRequest request) {
        try {
            boolean success = propertyService.applyPriceUpdate(id, request.getNewPrice());
            if (success) {
                return ResponseEntity.ok(Map.of(
                    "message", "Prezzo aggiornato con successo a € " + request.getNewPrice(),
                    "newPrice", request.getNewPrice()
                ));
            }
            return ResponseEntity.badRequest().body("Impossibile aggiornare il prezzo");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProperty(@PathVariable Long id) {
        boolean deleted = propertyDAO.delete(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Property>> getPropertiesBySeller(@PathVariable Long sellerId) {
        return ResponseEntity.ok(propertyDAO.findBySellerId(sellerId));
    }
}
