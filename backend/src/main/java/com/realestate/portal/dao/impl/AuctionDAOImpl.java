package com.realestate.portal.dao.impl;

import com.realestate.portal.dao.AuctionDAO;
import com.realestate.portal.model.Auction;
import com.realestate.portal.model.Bid;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class AuctionDAOImpl implements AuctionDAO {

    private final JdbcTemplate jdbcTemplate;

    public AuctionDAOImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Auction> auctionRowMapper = (rs, rowNum) -> {
        Auction a = new Auction();
        a.setId(rs.getLong("id"));
        a.setPropertyId(rs.getLong("property_id"));
        a.setStartingPrice(rs.getBigDecimal("starting_price"));
        a.setCurrentHighestBid(rs.getBigDecimal("current_highest_bid"));
        long bidderId = rs.getLong("highest_bidder_id");
        if (!rs.wasNull()) {
            a.setHighestBidderId(bidderId);
        }
        a.setHighestBidderName(rs.getString("highest_bidder_name"));
        Timestamp startTs = rs.getTimestamp("start_date");
        if (startTs != null) a.setStartDate(startTs.toLocalDateTime());
        Timestamp endTs = rs.getTimestamp("end_date");
        if (endTs != null) a.setEndDate(endTs.toLocalDateTime());
        a.setActive(rs.getBoolean("is_active"));
        Timestamp createdTs = rs.getTimestamp("created_at");
        if (createdTs != null) a.setCreatedAt(createdTs.toLocalDateTime());
        return a;
    };

    private final RowMapper<Bid> bidRowMapper = (rs, rowNum) -> {
        Bid b = new Bid();
        b.setId(rs.getLong("id"));
        b.setAuctionId(rs.getLong("auction_id"));
        b.setBuyerId(rs.getLong("buyer_id"));
        b.setBuyerName(rs.getString("buyer_name"));
        b.setBidAmount(rs.getBigDecimal("bid_amount"));
        Timestamp ts = rs.getTimestamp("bid_time");
        if (ts != null) b.setBidTime(ts.toLocalDateTime());
        return b;
    };

    @Override
    public Optional<Auction> findById(Long id) {
        String sql = "SELECT a.*, (u.first_name || ' ' || u.last_name) AS highest_bidder_name " +
                     "FROM auctions a " +
                     "LEFT JOIN users u ON a.highest_bidder_id = u.id " +
                     "WHERE a.id = ?";
        try {
            Auction a = jdbcTemplate.queryForObject(sql, auctionRowMapper, id);
            return Optional.ofNullable(a);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Auction> findByPropertyId(Long propertyId) {
        String sql = "SELECT a.*, (u.first_name || ' ' || u.last_name) AS highest_bidder_name " +
                     "FROM auctions a " +
                     "LEFT JOIN users u ON a.highest_bidder_id = u.id " +
                     "WHERE a.property_id = ?";
        try {
            Auction a = jdbcTemplate.queryForObject(sql, auctionRowMapper, propertyId);
            return Optional.ofNullable(a);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Auction save(Auction auction) {
        String sql = "INSERT INTO auctions (property_id, starting_price, current_highest_bid, highest_bidder_id, start_date, end_date, is_active, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, auction.getPropertyId());
            ps.setBigDecimal(2, auction.getStartingPrice());
            ps.setBigDecimal(3, auction.getCurrentHighestBid() != null ? auction.getCurrentHighestBid() : auction.getStartingPrice());
            if (auction.getHighestBidderId() != null) {
                ps.setLong(4, auction.getHighestBidderId());
            } else {
                ps.setNull(4, java.sql.Types.INTEGER);
            }
            ps.setTimestamp(5, Timestamp.valueOf(auction.getStartDate()));
            ps.setTimestamp(6, Timestamp.valueOf(auction.getEndDate()));
            ps.setBoolean(7, auction.isActive());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            auction.setId(keyHolder.getKey().longValue());
        }
        return auction;
    }

    @Override
    public boolean updateHighestBid(Long auctionId, BigDecimal amount, Long bidderId) {
        String sql = "UPDATE auctions SET current_highest_bid = ?, highest_bidder_id = ? WHERE id = ?";
        int rows = jdbcTemplate.update(sql, amount, bidderId, auctionId);
        return rows > 0;
    }

    @Override
    public boolean closeAuction(Long auctionId) {
        String sql = "UPDATE auctions SET is_active = false WHERE id = ?";
        int rows = jdbcTemplate.update(sql, auctionId);
        return rows > 0;
    }

    @Override
    public Bid saveBid(Bid bid) {
        String sql = "INSERT INTO bids (auction_id, buyer_id, bid_amount, bid_time) VALUES (?, ?, ?, CURRENT_TIMESTAMP)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, bid.getAuctionId());
            ps.setLong(2, bid.getBuyerId());
            ps.setBigDecimal(3, bid.getBidAmount());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            bid.setId(keyHolder.getKey().longValue());
        }

        updateHighestBid(bid.getAuctionId(), bid.getBidAmount(), bid.getBuyerId());
        return bid;
    }

    @Override
    public List<Bid> findBidsByAuctionId(Long auctionId) {
        String sql = "SELECT b.*, (u.first_name || ' ' || u.last_name) AS buyer_name " +
                     "FROM bids b " +
                     "JOIN users u ON b.buyer_id = u.id " +
                     "WHERE b.auction_id = ? " +
                     "ORDER BY b.bid_time DESC";
        return jdbcTemplate.query(sql, bidRowMapper, auctionId);
    }
}
