package com.realestate.portal.dao.impl;

import com.realestate.portal.dao.ReviewDAO;
import com.realestate.portal.model.Review;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class ReviewDAOImpl implements ReviewDAO {

    private final JdbcTemplate jdbcTemplate;

    public ReviewDAOImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Review> reviewRowMapper = (rs, rowNum) -> {
        Review r = new Review();
        r.setId(rs.getLong("id"));
        r.setPropertyId(rs.getLong("property_id"));
        r.setBuyerId(rs.getLong("buyer_id"));
        r.setBuyerName(rs.getString("buyer_name"));
        r.setRating(rs.getInt("rating"));
        r.setComment(rs.getString("comment"));
        r.setHasVisited(rs.getBoolean("has_visited"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            r.setCreatedAt(ts.toLocalDateTime());
        }
        return r;
    };

    @Override
    public List<Review> findByPropertyId(Long propertyId) {
        String sql = "SELECT r.*, (u.first_name || ' ' || u.last_name) AS buyer_name " +
                     "FROM reviews r " +
                     "JOIN users u ON r.buyer_id = u.id " +
                     "WHERE r.property_id = ? " +
                     "ORDER BY r.created_at DESC";
        return jdbcTemplate.query(sql, reviewRowMapper, propertyId);
    }

    @Override
    public Optional<Review> findById(Long id) {
        String sql = "SELECT r.*, (u.first_name || ' ' || u.last_name) AS buyer_name " +
                     "FROM reviews r " +
                     "JOIN users u ON r.buyer_id = u.id " +
                     "WHERE r.id = ?";
        try {
            Review r = jdbcTemplate.queryForObject(sql, reviewRowMapper, id);
            return Optional.ofNullable(r);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Review save(Review review) {
        String sql = "INSERT INTO reviews (property_id, buyer_id, rating, comment, has_visited, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, review.getPropertyId());
            ps.setLong(2, review.getBuyerId());
            ps.setInt(3, review.getRating());
            ps.setString(4, review.getComment());
            ps.setBoolean(5, review.isHasVisited());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            review.setId(keyHolder.getKey().longValue());
        }
        return review;
    }

    @Override
    public boolean delete(Long id) {
        String sql = "DELETE FROM reviews WHERE id = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows > 0;
    }

    @Override
    public List<Review> findAll() {
        String sql = "SELECT r.*, (u.first_name || ' ' || u.last_name) AS buyer_name " +
                     "FROM reviews r " +
                     "JOIN users u ON r.buyer_id = u.id " +
                     "ORDER BY r.created_at DESC";
        return jdbcTemplate.query(sql, reviewRowMapper);
    }
}
