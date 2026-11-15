package com.realestate.portal.controller;

import com.realestate.portal.dto.FacebookPromotionRequest;
import com.realestate.portal.dto.FacebookPromotionResponse;
import com.realestate.portal.service.FacebookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/facebook")
@CrossOrigin(origins = "*")
public class FacebookApiController {

    private final FacebookService facebookService;

    public FacebookApiController(FacebookService facebookService) {
        this.facebookService = facebookService;
    }

    @PostMapping("/publish")
    public ResponseEntity<FacebookPromotionResponse> publishToFacebookPage(@RequestBody FacebookPromotionRequest request) {
        FacebookPromotionResponse response = facebookService.publishToPage(request);
        return ResponseEntity.ok(response);
    }
}
