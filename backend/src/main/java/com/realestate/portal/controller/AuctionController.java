package com.realestate.portal.controller;

import com.realestate.portal.dao.AuctionDAO;
import com.realestate.portal.dao.PropertyDAO;
import com.realestate.portal.dto.AuctionRequest;
import com.realestate.portal.dto.BidRequest;
import com.realestate.portal.model.Auction;
import com.realestate.portal.model.Bid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(origins = "*")
public class AuctionController {

    private final AuctionDAO auctionDAO;
    private final PropertyDAO propertyDAO;

    public AuctionController(AuctionDAO auctionDAO, PropertyDAO propertyDAO) {
        this.auctionDAO = auctionDAO;
        this.propertyDAO = propertyDAO;
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<Auction> getAuctionByProperty(@PathVariable Long propertyId) {
        return auctionDAO.findByPropertyId(propertyId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public ResponseEntity<?> createAuction(@RequestBody AuctionRequest request) {
        if (auctionDAO.findByPropertyId(request.getPropertyId()).isPresent()) {
            return ResponseEntity.badRequest().body("Esiste già un'asta per questo immobile.");
        }

        Auction auction = new Auction();
        auction.setPropertyId(request.getPropertyId());
        auction.setStartingPrice(request.getStartingPrice());
        auction.setCurrentHighestBid(request.getStartingPrice());
        auction.setStartDate(request.getStartDate() != null ? request.getStartDate() : LocalDateTime.now());
        auction.setEndDate(request.getEndDate() != null ? request.getEndDate() : LocalDateTime.now().plusDays(7));
        auction.setActive(true);

        Auction saved = auctionDAO.save(auction);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/bid")
    public ResponseEntity<?> placeBid(@RequestBody BidRequest request) {
        Optional<Auction> auctionOpt = auctionDAO.findById(request.getAuctionId());
        if (auctionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Auction auction = auctionOpt.get();
        if (!auction.isActive() || (auction.getEndDate() != null && LocalDateTime.now().isAfter(auction.getEndDate()))) {
            return ResponseEntity.badRequest().body("Questa asta è chiusa.");
        }

        BigDecimal minRequired = auction.getCurrentHighestBid() != null ? auction.getCurrentHighestBid() : auction.getStartingPrice();
        if (request.getAmount().compareTo(minRequired) <= 0) {
            return ResponseEntity.badRequest().body("L'offerta deve essere strettamente superiore all'offerta corrente di € " + minRequired);
        }

        Bid bid = new Bid();
        bid.setAuctionId(auction.getId());
        bid.setBuyerId(request.getBuyerId());
        bid.setBidAmount(request.getAmount());

        Bid savedBid = auctionDAO.saveBid(bid);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBid);
    }

    @GetMapping("/{auctionId}/bids")
    public ResponseEntity<List<Bid>> getBids(@PathVariable Long auctionId) {
        return ResponseEntity.ok(auctionDAO.findBidsByAuctionId(auctionId));
    }
}
