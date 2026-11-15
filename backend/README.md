# Portale Immobiliare - Backend Spring Boot & PostgreSQL

Questo modulo implementa il backend dell'applicazione per annunci di affitto/vendita di immobili, rispondendo a tutti i requisiti specificati:

1. **Pattern DAO (Data Access Object)**:
   - Separazione pulita tra logica di business e accesso ai dati con interfacce (`UserDAO`, `PropertyDAO`, `CategoryDAO`, `ReviewDAO`, `ContactMessageDAO`, `AuctionDAO`) e implementazioni basate su `JdbcTemplate` nativo per PostgreSQL.
   - **Almeno 5 tabelle**: il database include ben **9 tabelle** (`users`, `categories`, `properties`, `property_images`, `reviews`, `contact_messages`, `auctions`, `bids`, `facebook_promotions`).
2. **Design Pattern Proxy**:
   - Implementazione del **Virtual Proxy (Lazy Loading)** sulla relazione Uno-a-Molti dell'entità `Property` (`IProperty`, `RealProperty`, `PropertyProxy`).
   - Le collezioni `reviews`, `additionalImages` e `auction` non vengono caricate finché il chiamante non invoca esplicitamente il rispettivo getter sul Proxy.
   - Test di unità dedicato `ProxyPatternTest.java`.
3. **@RestController con JSON**:
   - `AuthController`, `PropertyController`, `CategoryController`, `ReviewController`, `ContactController`, `AuctionController`, `AdminController`, `FacebookApiController`.
4. **Funzionalità Ruoli & Utenti Pre-configurati**:
   - **Super Amministratore**: `superadmin@realestate.it` / `admin123` (`Lorenzo Direttore`), ban/sbanna utenti, nomina altri amministratori, retrocessione admin nominati, moderazione globale.
   - **Venditori**: `monica.voci@realestate.it` / `seller123` (`Monica Voci`) e `luigi.cozza@realestate.it` / `seller123` (`Luigi Cozza`). Creazione/modifica/cancellazione annunci, ribasso prezzo con vecchio prezzo barrato (`PATCH /api/properties/{id}/price-drop`), creazione aste, integrazione API Facebook (`POST /api/facebook/publish`), ricezione messaggi di contatto. Se nominati admin, mantengono la dashboard venditore per i propri immobili.
   - **Acquirente**: `gennaro.guarino@email.it` / `buyer123` (`Gennaro Guarino`). Filtro vendita/affitto e categorie, ordinamento per prezzo e/o mq, recensioni solo con verifica visita (`hasVisited = true`), modulo contatto con oggetto prefissato `[ANN-ID] Titolo`.
   - **Ospite**: accesso in sola lettura con richiesta di autenticazione per recensioni, contatti e offerte d'asta.

## Avvio del Backend

### Prerequisiti
- Java 17 o superiore
- PostgreSQL attivo su porta 5432 (database: `realestate_db`) oppure tramite Docker

### Tramite Docker Compose (Postgres + Backend + Frontend)
Dalla cartella principale del progetto:
```bash
docker compose up -d
```

### Avvio Standalone con Maven
```bash
cd backend
mvn clean spring-boot:run
```
L'applicazione avvierà il server su `http://localhost:8080`.
All'avvio, `schema.sql` e `data.sql` popoleranno automaticamente le tabelle con gli utenti predefiniti e gli annunci di esempio.
