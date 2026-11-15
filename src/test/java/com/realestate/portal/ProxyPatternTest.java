package com.realestate.portal;

import com.realestate.portal.dao.AuctionDAO;
import com.realestate.portal.dao.PropertyDAO;
import com.realestate.portal.dao.ReviewDAO;
import com.realestate.portal.model.Review;
import com.realestate.portal.proxy.PropertyProxy;
import com.realestate.portal.proxy.RealProperty;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Test di unita' a verifica del Requisito:
 * "Richiesta l'implementazione del pattern Proxy su almeno una relazione
 * uno a molti o molti a molti"
 */
public class ProxyPatternTest {

    @Test
    @DisplayName("Verifica che il Virtual Proxy carichi la relazione 1-a-N 'reviews' solo on-demand (Lazy Loading)")
    public void testLazyLoadingVirtualProxy() {
        // 1. Arrange Mocks e Oggetto Reale
        ReviewDAO mockReviewDAO = Mockito.mock(ReviewDAO.class);
        PropertyDAO mockPropertyDAO = Mockito.mock(PropertyDAO.class);
        AuctionDAO mockAuctionDAO = Mockito.mock(AuctionDAO.class);

        RealProperty realProperty = new RealProperty();
        realProperty.setId(101L);
        realProperty.setTitle("Villa Panoramica con Giardino");
        realProperty.setCurrentPrice(new BigDecimal("450000.00"));

        Review r1 = new Review();
        r1.setId(1L);
        r1.setPropertyId(101L);
        r1.setRating(5);
        r1.setComment("Visita eccellente");
        r1.setHasVisited(true);

        when(mockReviewDAO.findByPropertyId(101L)).thenReturn(Arrays.asList(r1));

        // Inizializzazione Proxy
        PropertyProxy proxy = new PropertyProxy(realProperty, mockReviewDAO, mockPropertyDAO, mockAuctionDAO);

        // 2. Assert prima dell'invocazione di getReviews()
        assertFalse(proxy.isReviewsLoaded(), "Le recensioni non devono essere caricate all'inizializzazione del proxy");
        verify(mockReviewDAO, never()).findByPropertyId(anyLong());

        // L'accesso a campi scalari non deve attivare il caricamento delle recensioni
        assertEquals("Villa Panoramica con Giardino", proxy.getTitle());
        assertEquals(new BigDecimal("450000.00"), proxy.getCurrentPrice());
        verify(mockReviewDAO, never()).findByPropertyId(anyLong());

        // 3. Act: invocazione della relazione 1-a-N
        List<Review> reviews = proxy.getReviews();

        // 4. Assert: ora la relazione e' caricata e il DAO e' stato chiamato esattamente una volta
        assertTrue(proxy.isReviewsLoaded(), "Il flag reviewsLoaded deve risultare true dopo l'accesso");
        assertEquals(1, reviews.size());
        assertEquals("Visita eccellente", reviews.get(0).getComment());
        verify(mockReviewDAO, times(1)).findByPropertyId(101L);

        // Un secondo accesso non deve richiamare il DAO (Caching interno del proxy)
        proxy.getReviews();
        verify(mockReviewDAO, times(1)).findByPropertyId(101L);
    }
}
