package com.realestate.portal.dao.impl;

import com.realestate.portal.dao.PropertyDAO;
import com.realestate.portal.model.Property;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class PropertyDAOImpl implements PropertyDAO {

    private final JdbcTemplate jdbcTemplate;

    public PropertyDAOImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Property> propertyRowMapper = (rs, rowNum) -> {
        Property p = new Property();
        p.setId(rs.getLong("id"));
        p.setSellerId(rs.getLong("seller_id"));
        p.setSellerName(rs.getString("seller_name"));
        p.setCategoryId(rs.getLong("category_id"));
        p.setCategoryName(rs.getString("category_name"));
        p.setTitle(rs.getString("title"));
        p.setDescription(rs.getString("description"));
        p.setTransactionType(rs.getString("transaction_type"));
        p.setOriginalPrice(rs.getBigDecimal("original_price"));
        p.setCurrentPrice(rs.getBigDecimal("current_price"));
        p.setHasPriceDrop(rs.getBoolean("has_price_drop"));
        p.setSquareMeters(rs.getInt("square_meters"));
        p.setRooms(rs.getInt("rooms"));
        p.setBathrooms(rs.getInt("bathrooms"));
        p.setAddress(rs.getString("address"));
        p.setCity(rs.getString("city"));
        p.setLatitude(rs.getDouble("latitude"));
        p.setLongitude(rs.getDouble("longitude"));
        p.setMainImageUrl(rs.getString("main_image_url"));
        Timestamp createdTs = rs.getTimestamp("created_at");
        if (createdTs != null) p.setCreatedAt(createdTs.toLocalDateTime());
        Timestamp updatedTs = rs.getTimestamp("updated_at");
        if (updatedTs != null) p.setUpdatedAt(updatedTs.toLocalDateTime());
        return p;
    };

    @Override
    public Optional<Property> findById(Long id) {
        String sql = "SELECT p.*, (u.first_name || ' ' || u.last_name) AS seller_name, c.name AS category_name " +
                     "FROM properties p " +
                     "JOIN users u ON p.seller_id = u.id " +
                     "JOIN categories c ON p.category_id = c.id " +
                     "WHERE p.id = ?";
        try {
            Property p = jdbcTemplate.queryForObject(sql, propertyRowMapper, id);
            return Optional.ofNullable(p);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Property> findAllFiltered(
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
        StringBuilder sql = new StringBuilder(
            "SELECT p.*, (u.first_name || ' ' || u.last_name) AS seller_name, c.name AS category_name " +
            "FROM properties p " +
            "JOIN users u ON p.seller_id = u.id " +
            "JOIN categories c ON p.category_id = c.id " +
            "WHERE u.is_banned = false "
        );
        List<Object> params = new ArrayList<>();

        if (transactionType != null && !transactionType.isBlank() && !transactionType.equalsIgnoreCase("ALL")) {
            sql.append("AND p.transaction_type = ? ");
            params.add(transactionType.toUpperCase());
        }

        if (categoryId != null && categoryId > 0) {
            sql.append("AND p.category_id = ? ");
            params.add(categoryId);
        }

        if (minPrice != null) {
            sql.append("AND p.current_price >= ? ");
            params.add(minPrice);
        }

        if (maxPrice != null) {
            sql.append("AND p.current_price <= ? ");
            params.add(maxPrice);
        }

        if (minSqm != null) {
            sql.append("AND p.square_meters >= ? ");
            params.add(minSqm);
        }

        if (maxSqm != null) {
            sql.append("AND p.square_meters <= ? ");
            params.add(maxSqm);
        }

        if (city != null && !city.isBlank()) {
            sql.append("AND LOWER(p.city) LIKE LOWER(?) ");
            params.add("%" + city.trim() + "%");
        }

        // Ordinamento per prezzo e/o metri quadri (richiesto da specifica)
        String direction = "ASC";
        if (sortDir != null && sortDir.equalsIgnoreCase("DESC")) {
            direction = "DESC";
        }

        if ("price".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY p.current_price ").append(direction);
        } else if ("sqm".equalsIgnoreCase(sortBy) || "square_meters".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY p.square_meters ").append(direction);
        } else if ("price_and_sqm".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY p.current_price ").append(direction).append(", p.square_meters ").append(direction);
        } else {
            sql.append("ORDER BY p.created_at DESC");
        }

        return jdbcTemplate.query(sql.toString(), propertyRowMapper, params.toArray());
    }

    @Override
    public List<Property> findBySellerId(Long sellerId) {
        String sql = "SELECT p.*, (u.first_name || ' ' || u.last_name) AS seller_name, c.name AS category_name " +
                     "FROM properties p " +
                     "JOIN users u ON p.seller_id = u.id " +
                     "JOIN categories c ON p.category_id = c.id " +
                     "WHERE p.seller_id = ? " +
                     "ORDER BY p.created_at DESC";
        return jdbcTemplate.query(sql, propertyRowMapper, sellerId);
    }

    @Override
    public Property save(Property property) {
        String sql = "INSERT INTO properties (seller_id, category_id, title, description, transaction_type, " +
                     "original_price, current_price, has_price_drop, square_meters, rooms, bathrooms, address, city, " +
                     "latitude, longitude, main_image_url, created_at, updated_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, property.getSellerId());
            ps.setLong(2, property.getCategoryId());
            ps.setString(3, property.getTitle());
            ps.setString(4, property.getDescription());
            ps.setString(5, property.getTransactionType() != null ? property.getTransactionType() : "SALE");
            ps.setBigDecimal(6, property.getOriginalPrice() != null ? property.getOriginalPrice() : BigDecimal.ZERO);
            ps.setBigDecimal(7, property.getCurrentPrice() != null ? property.getCurrentPrice() : property.getOriginalPrice());
            ps.setBoolean(8, property.isHasPriceDrop());
            ps.setInt(9, property.getSquareMeters());
            ps.setInt(10, property.getRooms());
            ps.setInt(11, property.getBathrooms());
            ps.setString(12, property.getAddress());
            ps.setString(13, property.getCity());
            ps.setDouble(14, property.getLatitude() != null ? property.getLatitude() : 0.0);
            ps.setDouble(15, property.getLongitude() != null ? property.getLongitude() : 0.0);
            ps.setString(16, property.getMainImageUrl());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            property.setId(keyHolder.getKey().longValue());
        }
        return property;
    }

    @Override
    public boolean update(Property property) {
        String sql = "UPDATE properties SET category_id = ?, title = ?, description = ?, transaction_type = ?, " +
                     "current_price = ?, square_meters = ?, rooms = ?, bathrooms = ?, address = ?, city = ?, " +
                     "latitude = ?, longitude = ?, main_image_url = ?, updated_at = CURRENT_TIMESTAMP " +
                     "WHERE id = ?";
        int rows = jdbcTemplate.update(
            sql,
            property.getCategoryId(),
            property.getTitle(),
            property.getDescription(),
            property.getTransactionType(),
            property.getCurrentPrice(),
            property.getSquareMeters(),
            property.getRooms(),
            property.getBathrooms(),
            property.getAddress(),
            property.getCity(),
            property.getLatitude(),
            property.getLongitude(),
            property.getMainImageUrl(),
            property.getId()
        );
        return rows > 0;
    }

    @Override
    public boolean updatePriceDrop(Long propertyId, BigDecimal newPrice) {
        String sql = "UPDATE properties SET current_price = ?, has_price_drop = true, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        int rows = jdbcTemplate.update(sql, newPrice, propertyId);
        return rows > 0;
    }

    @Override
    public boolean updatePrice(Long propertyId, BigDecimal newPrice, boolean hasPriceDrop, BigDecimal originalPrice) {
        String sql = "UPDATE properties SET current_price = ?, has_price_drop = ?, original_price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        int rows = jdbcTemplate.update(sql, newPrice, hasPriceDrop, originalPrice, propertyId);
        return rows > 0;
    }

    @Override
    public boolean delete(Long id) {
        String sql = "DELETE FROM properties WHERE id = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows > 0;
    }

    @Override
    public List<String> findImagesByPropertyId(Long propertyId) {
        String sql = "SELECT image_url FROM property_images WHERE property_id = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("image_url"), propertyId);
    }

    @Override
    public void addImage(Long propertyId, String imageUrl) {
        String sql = "INSERT INTO property_images (property_id, image_url) VALUES (?, ?)";
        jdbcTemplate.update(sql, propertyId, imageUrl);
    }

    @Override
    public void deleteImagesByPropertyId(Long propertyId) {
        String sql = "DELETE FROM property_images WHERE property_id = ?";
        jdbcTemplate.update(sql, propertyId);
    }
}
