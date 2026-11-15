package com.realestate.portal.dao;

import com.realestate.portal.model.Auction;
import com.realestate.portal.model.Bid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface AuctionDAO {
    Optional<Auction> findById(Long id);
    Optional<Auction> findByPropertyId(Long propertyId);
    Auction save(Auction auction);
    boolean updateHighestBid(Long auctionId, BigDecimal amount, Long bidderId);
    boolean closeAuction(Long auctionId);
    Bid saveBid(Bid bid);
    List<Bid> findBidsByAuctionId(Long auctionId);
}
