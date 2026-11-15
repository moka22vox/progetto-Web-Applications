package com.realestate.portal.service;

import com.realestate.portal.dao.AuctionDAO;
import com.realestate.portal.dao.PropertyDAO;
import com.realestate.portal.dao.ReviewDAO;
import com.realestate.portal.model.Property;
import com.realestate.portal.proxy.IProperty;
import com.realestate.portal.proxy.PropertyProxy;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    private final PropertyDAO propertyDAO;
    private final ReviewDAO reviewDAO;
    private final AuctionDAO auctionDAO;

    public PropertyService(PropertyDAO propertyDAO, ReviewDAO reviewDAO, AuctionDAO auctionDAO) {
        this.propertyDAO = propertyDAO;
        this.reviewDAO = reviewDAO;
        this.auctionDAO = auctionDAO;
    }

    /**
     * Ottiene l'immobile incapsulato nel DESIGN PATTERN PROXY.
     * Le relazioni 1-a-N (recensioni, immagini aggiuntive, asta) non vengono caricate
     * immediatamente, ma tramite Lazy Loading solo quando i metodi getReviews(),
     * getAdditionalImages() o getAuction() vengono invocati.
     */
    public Optional<IProperty> getPropertyWithProxy(Long id) {
        Optional<Property> realPropOpt = propertyDAO.findById(id);
        if (realPropOpt.isEmpty()) {
            return Optional.empty();
        }

        Property realProperty = realPropOpt.get();
        // Inizializzazione del Virtual Proxy
        IProperty proxy = new PropertyProxy(realProperty, reviewDAO, propertyDAO, auctionDAO);
        return Optional.of(proxy);
    }

    /**
     * Gestisce la modifica del prezzo (Requisito Venditore):
     * Consente sia di ribassare il prezzo (in tal caso il vecchio prezzo sarà barrato e verrà mostrato il nuovo prezzo),
     * sia di alzare il prezzo dell'immobile.
     */
    public boolean applyPriceDrop(Long propertyId, BigDecimal newPrice) {
        return applyPriceUpdate(propertyId, newPrice);
    }

    public boolean applyPriceUpdate(Long propertyId, BigDecimal newPrice) {
        Property property = propertyDAO.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Immobile non trovato"));

        if (newPrice == null || newPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Il prezzo deve essere maggiore di zero");
        }

        BigDecimal origPrice = property.getOriginalPrice() != null ? property.getOriginalPrice() : property.getCurrentPrice();
        boolean hasPriceDrop;

        if (newPrice.compareTo(origPrice) < 0) {
            // Ribasso rispetto al prezzo originale: attiva il prezzo barrato
            hasPriceDrop = true;
        } else {
            // Prezzo alzato o uguale all'originale: aggiorna il prezzo originale e rimuove lo sconto barrato
            hasPriceDrop = false;
            origPrice = newPrice;
        }

        return propertyDAO.updatePrice(propertyId, newPrice, hasPriceDrop, origPrice);
    }

    public List<Property> searchProperties(
            String transactionType,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minSqm,
            Integer maxSqm,
            String city,
            String sortBy,
            String sortDir
    ) {
        return propertyDAO.findAllFiltered(transactionType, categoryId, minPrice, maxPrice, minSqm, maxSqm, city, sortBy, sortDir);
    }
}
