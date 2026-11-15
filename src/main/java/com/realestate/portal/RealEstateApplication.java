package com.realestate.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RealEstateApplication {

    public static void main(String[] args) {
        SpringApplication.run(RealEstateApplication.class, args);
        System.out.println("===============================================================");
        System.out.println(" Backend Portale Immobiliare avviato su: http://localhost:8080 ");
        System.out.println(" Swagger / API REST pronte per il frontend Angular             ");
        System.out.println(" DAO Pattern attivo con PostgreSQL                            ");
        System.out.println(" Proxy Design Pattern attivo su relazione 1-a-N (Property)      ");
        System.out.println("===============================================================");
    }
}
