package com.realestate.portal.dao.impl;

import com.realestate.portal.dao.UserDAO;
import com.realestate.portal.model.Role;
import com.realestate.portal.model.User;
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
public class UserDAOImpl implements UserDAO {

    private final JdbcTemplate jdbcTemplate;

    public UserDAOImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setFirstName(rs.getString("first_name"));
        user.setLastName(rs.getString("last_name"));
        user.setPhone(rs.getString("phone"));
        user.setRole(Role.fromString(rs.getString("role")));
        user.setBanned(rs.getBoolean("is_banned"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            user.setCreatedAt(ts.toLocalDateTime());
        }
        return user;
    };

    @Override
    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try {
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, id);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE LOWER(email) = LOWER(?)";
        try {
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, email);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<User> findAll() {
        String sql = "SELECT * FROM users ORDER BY id ASC";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    @Override
    public User save(User user) {
        String sql = "INSERT INTO users (email, password, first_name, last_name, phone, role, is_banned, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getEmail());
            ps.setString(2, user.getPassword());
            ps.setString(3, user.getFirstName());
            ps.setString(4, user.getLastName());
            ps.setString(5, user.getPhone());
            ps.setString(6, user.getRole() != null ? user.getRole().name() : Role.BUYER.name());
            ps.setBoolean(7, user.isBanned());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            user.setId(keyHolder.getKey().longValue());
        }
        return user;
    }

    @Override
    public boolean update(User user) {
        String sql = "UPDATE users SET first_name = ?, last_name = ?, phone = ?, role = ? WHERE id = ?";
        int rows = jdbcTemplate.update(sql, user.getFirstName(), user.getLastName(), user.getPhone(), user.getRole().name(), user.getId());
        return rows > 0;
    }

    @Override
    public boolean setBanned(Long userId, boolean isBanned) {
        String sql = "UPDATE users SET is_banned = ? WHERE id = ?";
        int rows = jdbcTemplate.update(sql, isBanned, userId);
        return rows > 0;
    }

    @Override
    public boolean updateRole(Long userId, Role role) {
        String sql = "UPDATE users SET role = ? WHERE id = ?";
        int rows = jdbcTemplate.update(sql, role.name(), userId);
        return rows > 0;
    }

    @Override
    public boolean delete(Long id) {
        String sql = "DELETE FROM users WHERE id = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows > 0;
    }
}
