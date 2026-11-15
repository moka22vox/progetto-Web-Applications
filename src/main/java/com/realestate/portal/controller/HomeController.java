package com.realestate.portal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Controller di Root per il Backend Spring Boot.
 * Risolve l'errore "Whitelabel Error Page" quando l'utente apre http://localhost:8080/
 * reindirizzando direttamente all'applicazione web completa servita da /index.html.
 */
@Controller
public class HomeController {

    /**
     * Mappatura root (http://localhost:8080/)
     * Inoltra automaticamente alla pagina web principale index.html
     */
    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }

    /**
     * Endpoint informativo sullo stato delle API (http://localhost:8080/api)
     */
    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> apiStatus() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("application", "Portale Immobiliare Backend REST API");
        info.put("status", "UP");
        info.put("version", "1.0.0");
        info.put("frontendUrl", "http://localhost:4200");
        info.put("portalUrl", "http://localhost:8080/");

        Map<String, String> endpoints = new LinkedHashMap<>();
        endpoints.put("properties", "/api/properties");
        endpoints.put("categories", "/api/categories");
        endpoints.put("auth", "/api/auth/login");
        endpoints.put("reviews", "/api/reviews/property/{id}");
        endpoints.put("auctions", "/api/auctions/{propertyId}");
        endpoints.put("contacts", "/api/contacts");
        endpoints.put("admin", "/api/admin/users");
        endpoints.put("facebook", "/api/facebook/publish/{propertyId}");
        info.put("endpoints", endpoints);

        return ResponseEntity.ok(info);
    }
}
