package com.realestate.portal.dao.impl;

import com.realestate.portal.dao.ContactMessageDAO;
import com.realestate.portal.model.ContactMessage;
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
public class ContactMessageDAOImpl implements ContactMessageDAO {

    private final JdbcTemplate jdbcTemplate;

    public ContactMessageDAOImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ContactMessage> messageRowMapper = (rs, rowNum) -> {
        ContactMessage m = new ContactMessage();
        m.setId(rs.getLong("id"));
        m.setPropertyId(rs.getLong("property_id"));
        m.setPropertyTitle(rs.getString("property_title"));
        m.setSellerId(rs.getLong("seller_id"));
        long buyerId = rs.getLong("buyer_id");
        if (!rs.wasNull()) {
            m.setBuyerId(buyerId);
        }
        m.setSubject(rs.getString("subject"));
        m.setBuyerName(rs.getString("buyer_name"));
        m.setBuyerEmail(rs.getString("buyer_email"));
        m.setBuyerPhone(rs.getString("buyer_phone"));
        m.setMessage(rs.getString("message"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            m.setCreatedAt(ts.toLocalDateTime());
        }
        return m;
    };

    @Override
    public ContactMessage save(ContactMessage message) {
        String sql = "INSERT INTO contact_messages (property_id, seller_id, buyer_id, subject, buyer_name, buyer_email, buyer_phone, message, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, message.getPropertyId());
            ps.setLong(2, message.getSellerId());
            if (message.getBuyerId() != null) {
                ps.setLong(3, message.getBuyerId());
            } else {
                ps.setNull(3, java.sql.Types.INTEGER);
            }
            ps.setString(4, message.getSubject());
            ps.setString(5, message.getBuyerName());
            ps.setString(6, message.getBuyerEmail());
            ps.setString(7, message.getBuyerPhone());
            ps.setString(8, message.getMessage());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            message.setId(keyHolder.getKey().longValue());
        }
        return message;
    }

    @Override
    public List<ContactMessage> findBySellerId(Long sellerId) {
        String sql = "SELECT m.*, p.title AS property_title " +
                     "FROM contact_messages m " +
                     "JOIN properties p ON m.property_id = p.id " +
                     "WHERE m.seller_id = ? " +
                     "ORDER BY m.created_at DESC";
        return jdbcTemplate.query(sql, messageRowMapper, sellerId);
    }

    @Override
    public List<ContactMessage> findByPropertyId(Long propertyId) {
        String sql = "SELECT m.*, p.title AS property_title " +
                     "FROM contact_messages m " +
                     "JOIN properties p ON m.property_id = p.id " +
                     "WHERE m.property_id = ? " +
                     "ORDER BY m.created_at DESC";
        return jdbcTemplate.query(sql, messageRowMapper, propertyId);
    }

    @Override
    public Optional<ContactMessage> findById(Long id) {
        String sql = "SELECT m.*, p.title AS property_title " +
                     "FROM contact_messages m " +
                     "JOIN properties p ON m.property_id = p.id " +
                     "WHERE m.id = ?";
        try {
            ContactMessage m = jdbcTemplate.queryForObject(sql, messageRowMapper, id);
            return Optional.ofNullable(m);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public boolean delete(Long id) {
        String sql = "DELETE FROM contact_messages WHERE id = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows > 0;
    }
}
