package com.realestate.portal.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Gestore globale degli errori di routing HTTP.
 * Intercetta le rotte non trovate o gli errori 404 e reindirizza automaticamente
 * alla home page dell'applicazione (/), eliminando completamente la "Whitelabel Error Page".
 */
@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        return "redirect:/";
    }
}
