package com.realestate.portal.controller;

import com.realestate.portal.dao.ContactMessageDAO;
import com.realestate.portal.dao.PropertyDAO;
import com.realestate.portal.dto.ContactRequest;
import com.realestate.portal.model.ContactMessage;
import com.realestate.portal.model.Property;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactMessageDAO contactMessageDAO;
    private final PropertyDAO propertyDAO;

    public ContactController(ContactMessageDAO contactMessageDAO, PropertyDAO propertyDAO) {
        this.contactMessageDAO = contactMessageDAO;
        this.propertyDAO = propertyDAO;
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody ContactRequest request) {
        Optional<Property> propertyOpt = propertyDAO.findById(request.getPropertyId());
        if (propertyOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Immobile non trovato.");
        }

        Property property = propertyOpt.get();

        ContactMessage msg = new ContactMessage();
        msg.setPropertyId(property.getId());
        msg.setPropertyTitle(property.getTitle());
        msg.setSellerId(property.getSellerId());
        msg.setBuyerId(request.getBuyerId());


        String subject = (request.getSubject() != null && !request.getSubject().isBlank())
                ? request.getSubject()
                : String.format("[ANN-%d] %s", property.getId(), property.getTitle());
        msg.setSubject(subject);

        msg.setBuyerName(request.getBuyerName());
        msg.setBuyerEmail(request.getBuyerEmail());
        msg.setBuyerPhone(request.getBuyerPhone());
        msg.setMessage(request.getMessage());

        ContactMessage saved = contactMessageDAO.save(msg);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ContactMessage>> getSellerMessages(@PathVariable Long sellerId) {
        return ResponseEntity.ok(contactMessageDAO.findBySellerId(sellerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        boolean deleted = contactMessageDAO.delete(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
