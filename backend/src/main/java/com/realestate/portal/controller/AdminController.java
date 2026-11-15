package com.realestate.portal.controller;

import com.realestate.portal.dao.PropertyDAO;
import com.realestate.portal.dao.ReviewDAO;
import com.realestate.portal.dao.UserDAO;
import com.realestate.portal.model.Role;
import com.realestate.portal.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserDAO userDAO;
    private final PropertyDAO propertyDAO;
    private final ReviewDAO reviewDAO;
    private final JdbcTemplate jdbcTemplate;

    public AdminController(UserDAO userDAO, PropertyDAO propertyDAO, ReviewDAO reviewDAO, JdbcTemplate jdbcTemplate) {
        this.userDAO = userDAO;
        this.propertyDAO = propertyDAO;
        this.reviewDAO = reviewDAO;
        this.jdbcTemplate = jdbcTemplate;
    }


    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userDAO.findAll());
    }


    @PutMapping("/users/{userId}/ban")
    public ResponseEntity<?> toggleBanUser(@PathVariable Long userId, @RequestParam boolean banned) {
        User user = userDAO.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }


        if (banned && (user.getId().equals(1L) || "superadmin@realestate.it".equalsIgnoreCase(user.getEmail()) || user.getRole() == Role.ADMIN)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Il Super Admin / Amministratore non può essere bannato!"));
        }

        boolean updated = userDAO.setBanned(userId, banned);
        if (updated) {
            return ResponseEntity.ok(Map.of(
                "message", banned ? "Utente bannato con successo" : "Utente riabilitato / sbannato con successo",
                "banned", banned,
                "userId", userId
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Impossibile aggiornare lo stato di ban dell'utente"));
    }


    @PutMapping("/users/{userId}/promote-admin")
    public ResponseEntity<?> promoteToAdmin(@PathVariable Long userId) {
        boolean updated = userDAO.updateRole(userId, Role.ADMIN);
        if (updated) {
            return ResponseEntity.ok(Map.of("message", "Utente promosso ad Amministratore con successo"));
        }
        return ResponseEntity.notFound().build();
    }


    @PutMapping("/users/{userId}/demote")
    public ResponseEntity<?> demoteAdmin(@PathVariable Long userId, @RequestParam(defaultValue = "BUYER") String targetRole) {
        if (userId.equals(1L)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Il Super Admin non può essere retrocesso"));
        }
        Role newRole = Role.fromString(targetRole);
        if (newRole == Role.ADMIN) {
            return ResponseEntity.badRequest().body(Map.of("error", "Il ruolo di destinazione deve essere SELLER o BUYER"));
        }
        boolean updated = userDAO.updateRole(userId, newRole);
        if (updated) {
            return ResponseEntity.ok(Map.of("message", "Amministratore retrocesso con successo a " + newRole, "role", newRole));
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        boolean deleted = userDAO.delete(userId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();

        Integer totalProperties = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM properties", Integer.class);
        Integer totalUsers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
        Integer totalReviews = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM reviews", Integer.class);
        Integer totalAuctions = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM auctions WHERE is_active = true", Integer.class);
        Integer totalSales = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM properties WHERE transaction_type = 'SALE'", Integer.class);
        Integer totalRents = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM properties WHERE transaction_type = 'RENT'", Integer.class);

        stats.put("totalProperties", totalProperties != null ? totalProperties : 0);
        stats.put("totalUsers", totalUsers != null ? totalUsers : 0);
        stats.put("totalReviews", totalReviews != null ? totalReviews : 0);
        stats.put("totalActiveAuctions", totalAuctions != null ? totalAuctions : 0);
        stats.put("totalSales", totalSales != null ? totalSales : 0);
        stats.put("totalRents", totalRents != null ? totalRents : 0);

        return ResponseEntity.ok(stats);
    }
}
