package com.realestate.portal.dao;

import com.realestate.portal.model.ContactMessage;
import java.util.List;
import java.util.Optional;

public interface ContactMessageDAO {
    ContactMessage save(ContactMessage message);
    List<ContactMessage> findBySellerId(Long sellerId);
    List<ContactMessage> findByPropertyId(Long propertyId);
    Optional<ContactMessage> findById(Long id);
    boolean delete(Long id);
}
