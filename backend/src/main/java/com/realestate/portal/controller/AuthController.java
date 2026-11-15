package com.realestate.portal.controller;

import com.realestate.portal.dao.UserDAO;
import com.realestate.portal.dto.AuthResponse;
import com.realestate.portal.dto.LoginRequest;
import com.realestate.portal.dto.RegisterRequest;
import com.realestate.portal.model.Role;
import com.realestate.portal.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserDAO userDAO;

    public AuthController(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userDAO.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenziali non valide o utente inesistente.");
        }

        User user = userOpt.get();
        if (user.isBanned()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Questo account è stato bannato dall'amministratore.");
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Password errata.");
        }


        String token = "TOKEN-" + user.getRole() + "-" + user.getId() + "-" + System.currentTimeMillis();
        AuthResponse response = new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                token,
                "Autenticazione avvenuta con successo"
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userDAO.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Un utente con questa email esiste già.");
        }

        Role role = Role.BUYER;
        if (request.getRole() != null) {
            role = Role.fromString(request.getRole());

            if (role == Role.ADMIN) {
                role = Role.BUYER;
            }
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setRole(role);
        user.setBanned(false);

        User saved = userDAO.save(user);

        String token = "TOKEN-" + saved.getRole() + "-" + saved.getId() + "-" + System.currentTimeMillis();
        AuthResponse response = new AuthResponse(
                saved.getId(),
                saved.getEmail(),
                saved.getFullName(),
                saved.getPhone(),
                saved.getRole(),
                token,
                "Registrazione completata con successo"
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
