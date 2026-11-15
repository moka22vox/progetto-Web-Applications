# Portale Web per Annunci di Affitto e Vendita di Immobili

Applicazione Web full-stack sviluppata con architettura moderna **Angular 17** (Frontend) e **Spring Boot 3 con PostgreSQL** (Backend), accompagnata da una **Demo Web Standalone interattiva zero-dipendenze** (`demo-app/index.html`), progettata secondo le specifiche e i requisiti accademici di Ingegneria del Software e Architetture Web.

---

## Utenti Pre-configurati nel Sistema

Nel database PostgreSQL (`data.sql`) e nell'applicazione interattiva sono già censiti e pronti all'uso i seguenti account:

| Utente | Ruolo | Email | Password | Descrizione & Permessi |
| :--- | :---: | :--- | :--- | :--- |
| **Lorenzo Direttore** | `ADMIN` (Super Admin) | `superadmin@realestate.it` | `admin123` | Amministratore principale pre-esistente nel DB. Moderazione globale su annunci e recensioni, ban/sbanna utenti, nomina altri utenti come amministratori. Non è retrocedibile né bannabile. |
| **Monica Voci** | `SELLER` | `monica.voci@realestate.it` | `seller123` | Profilo Venditore con annunci attivi nel sistema. Può creare, modificare ed eliminare annunci, applicare ribassi di prezzo, indire aste live, ricevere messaggi e promuovere su Facebook API. Se nominata admin, mantiene comunque l'accesso alla Dashboard Venditore per i suoi immobili. |
| **Luigi Cozza** | `SELLER` | `luigi.cozza@realestate.it` | `seller123` | Profilo Venditore con annunci e messaggi ricevuti. |
| **Gennaro Guarino** | `BUYER` | `gennaro.guarino@email.it` | `buyer123` | Profilo Acquirente autenticato. Può consultare immobili, filtrare e ordinare, inviare messaggi con oggetto precompilato, pubblicare recensioni (con verifica visita) e piazzare rilanci alle aste. |
| **Ospite (Guest)** | *Nessuno* | *Non autenticato* | *N/A* | Stato iniziale di default all'apertura dell'applicazione. Può esplorare l'intero catalogo annunci, visualizzare dettagli, mappa e grafico prezzi. Se tenta di contattare un venditore, inviare una recensione o piazzare un'offerta, viene avvisato e indirizzato al login/registrazione. |

---


### Architettura Software e Specifiche Tecniche
**Frontend in Angular 17**: Componenti standalone, routing modulare, RxJS, reactive updates.
**Backend Spring Boot 3**: Architettura REST a livelli con `@RestController` e trasferimento dati in formato standard JSON.
**Pattern DAO**: Accesso al database PostgreSQL strutturato su **9 tabelle relazionali** (`users`, `categories`, `properties`, `property_images`, `reviews`, `contact_messages`, `auctions`, `bids`, `facebook_promotions`) con query native via `JdbcTemplate`.
**Pattern Proxy (Virtual Lazy Proxy)**: Implementato sulle relazioni 1-a-N dell'immobile (`IProperty`, `RealProperty`, `PropertyProxy`) per caricamento differito delle recensioni e delle immagini, corredato da unit test dedicato (`ProxyPatternTest.java`).
**UI Responsive con Bootstrap 5** e **almeno 5 regole CSS personalizzate** documentate.
**Librerie esterne e API**:
  - **Chart.js**: Grafico a barre dei prezzi medi di mercato al mq per categoria, dinamico e aggiornato in tempo reale ad ogni nuovo annuncio o ribasso.
  - **Leaflet / Mapbox API**: Mappa geografica interattiva centrata sulle coordinate dell'immobile con token personalizzato.
  - **Facebook Graph API**: Integrazione pubblicazione social.

---

## Le Regole CSS Personalizzate

1. **`.price-strikethrough`**: Riga barrata rossa diagonale spessa 2.5px con opacità ridotta per evidenziare il vecchio prezzo dopo un ribasso.
2. **`.price-discount-tag`**: Badge a gradiente arancione-rosso brillante con animazione continua a pulsazione `@keyframes pulse-glow` per catturare l'attenzione sulle offerte ribassate.
3. **`.realestate-card-hover`**: Effetto di elevazione 3D con traslazione verso l'alto (`translateY(-6px)`), zoom fotografico (`scale(1.05)`) e ombra morbida colorata al passaggio del mouse.
4. **`.auction-active-ribbon`**: Nastro sagomato viola posizionato ad angolo sull'immagine per contrassegnare immediatamente le aste attive.
5. **`.verified-visitor-badge`**: Badge verde smeraldo con checkmark che attesta che l'acquirente ha eseguito il sopralluogo prima di recensire.
6. **`.custom-map-container`**: Contenitore della mappa con bordi arrotondati (border-radius 14px), overflow nascosto, bordo elegante e ombra profonda.
7. **`.role-select-card`**: Card di selezione ruolo interattiva per la registrazione con icone scalabili e colori distintivi per Acquirente (verde) e Venditore (ambra/arancione).

---

## Architettura del Progetto

```
realestate-portal/
├── backend/                       # Backend Spring Boot 3 + PostgreSQL
│   ├── src/main/java/com/realestate/portal/
│   │   ├── config/                # DatabaseConfig, CorsConfig
│   │   ├── model/                 # User, Category, Property, Review, Auction, Bid...
│   │   ├── proxy/                 # PATTERN PROXY: IProperty, RealProperty, PropertyProxy
│   │   ├── dao/                   # INTERFACCE DAO: UserDAO, PropertyDAO, ReviewDAO...
│   │   ├── dao/impl/              # IMPLEMENTAZIONI DAO con JdbcTemplate PostgreSQL nativo
│   │   ├── dto/                   # DTO per richieste/risposte JSON
│   │   ├── service/               # PropertyService, FacebookService
│   │   └── controller/            # @RestController: Auth, Property, Review, Auction, Admin...
│   ├── src/main/resources/
│   │   ├── application.properties # Parametri connessione Postgres e porta 8080
│   │   ├── schema.sql             # DDL: 9 tabelle relazionali e indici
│   │   └── data.sql               # DML: Seed iniziale con Super Admin, Venditori, Acquirenti e Annunci
│   └── src/test/java/com/realestate/portal/
│       └── ProxyPatternTest.java  # UNIT TEST: Verifica del Lazy Loading del Virtual Proxy
├── frontend/                      # Frontend Angular 17
│   ├── src/app/
│   │   ├── models/                # Interfacce TypeScript
│   │   ├── services/              # AuthService, PropertyService, FacebookService...
│   │   └── components/            # Navbar, PropertyList, Detail, Dashboards, Chart.js, PropertyForm...
│   └── src/styles.css             # Contiene le regole CSS personalizzate
├── demo-app/
│   └── index.html                 # Demo web interattiva autonoma zero-dipendenze
└── docker-compose.yml             # Avvio con container PostgreSQL + Backend + Frontend
```

---


## Guida Completa all'Utilizzo delle Funzionalità

### 1. Navigazione come Ospite e Autenticazione
* **Avvio iniziale**: L'applicazione si apre sempre in modalità **Ospite (Guest)**, mostrando l'intero catalogo di 11 immobili con filtri, mappa e grafico prezzi.
* **Azioni protette**: Se un utente ospite tenta di contattare un venditore, pubblicare una recensione o partecipare a un'asta, il sistema blocca l'azione visualizzando un messaggio esplicativo e aprendo automaticamente la finestra modale di **Accesso**.
* **Menu laterale destro**: Cliccando sull'icona profilo in alto a destra si apre la barra laterale con i pulsanti:
  * **Accedi**: login con email e password (ad es. `monica.voci@realestate.it` / `seller123` o `gennaro.guarino@email.it` / `buyer123`).
  * **Nuovo Profilo**: registrazione istantanea con scelta del ruolo tramite card visive interattive (Acquirente in verde, Venditore in arancione ambra).
  * **Cambia Ruolo**: permette di passare istantaneamente da un account all'altro tra Super Admin, Admin Nominati, Venditori e Acquirenti senza riscrivere le credenziali.
  * **Disconnetti**: ritorna allo stato di Ospite.

### 2. Funzionalità Acquirente 
* **Ricerca e Filtri**: È possibile filtrare gli immobili per tipo transazione (*Tutti*, *In Vendita*, *In Affitto*), categoria (*Appartamenti*, *Ville*, *Box Auto*, *Terreni Edificabili*, *Attici*), città, prezzo massimo e superficie minima in mq.
* **Ordinamento**: Ordinamento dinamico per prezzo crescente/decrescente, superficie crescente/decrescente o combinato (prezzo + mq).
* **Contatto Venditore**: Dalla scheda di dettaglio di un immobile, il modulo di contatto impone per specifica l'oggetto prefissato nel formato `[ANN-{ID}] {Titolo Annuncio}`.
* **Recensioni Condizionate da Sopralluogo**: L'acquirente può recensire un immobile con voto da 1 a 5 stelle solo se conferma di aver effettuato la visita sul posto (`hasVisited = true`), visualizzando il badge verde smeraldo `.verified-visitor-badge`.
* **Aste Live**: Sugli annunci contrassegnati dal nastro viola `.auction-active-ribbon`, l'acquirente può piazzare offerte al rialzo rispetto alla base d'asta o all'offerta corrente più alta.

### 3. Funzionalità Venditore 
* **Pubblica Annuncio**: Cliccando su *"Pubblica Annuncio"* si apre il modulo con:
  * Dati base: titolo, categoria, tipologia (Vendita/Affitto), prezzo e metri quadri.
  * Caratteristiche: **numero di locali** e **numero di bagni**.
  * Posizione: indirizzo, città, **coordinate geografiche (lat/lon)** con **mini-mappa Leaflet interattiva** (click sulla mappa o drag del marker) e pulsanti rapidi di preimpostazione città (Roma, Milano, Firenze, Napoli, Torino, Bologna, Cosenza).
  * Reset automatico: dopo il salvataggio o alla chiusura, il form viene azzerato e il grafico prezzi si aggiorna all'istante.
* **Dashboard Venditore**: Elenco dedicato per gestire esclusivamente i propri immobili:
  * **Ribasso Prezzo**: permette di inserire un nuovo prezzo scontato, mostrando visivamente il vecchio prezzo barrato in rosso (`.price-strikethrough`) e il badge lampeggiante *"RIBASSO PREZZO"* (`.price-discount-tag`).
  * **Attivazione Asta**: possibilità di indire un'asta competitiva impostando prezzo di partenza e data di scadenza.
  * **Promozione Facebook Graph API**: pulsante per pubblicare l'annuncio sulla pagina Facebook aziendale tramite API con generazione di Post ID e permalink.
  * **Eliminazione**: cancellazione immediata dell'annuncio con aggiornamento del grafico prezzi.

### 4. Funzionalità Amministratore 
* **Pannello Amministratore**: Accessibile dal menu di navigazione per gli account con ruolo `ADMIN`:
  * **Moderazione Globale**: cancellazione e modifica di qualsiasi annuncio o recensione presente nel portale.
  * **Bannare / Riabilitare Utenti**: inibisce l'accesso a utenti scorretti in tempo reale con badge di stato visivo.
  * **Nomina Admin**: promozione di venditori o acquirenti al ruolo di `Admin Nominato`.
  * **Retrocessione Admin**: gli admin nominati possono essere retrocessi al loro ruolo originario con un solo click (il Super Admin originario è protetto e non retrocedibile).
  * **Continuità Venditore**: se un venditore viene promosso ad admin, mantiene comunque l'accesso completo alla sua *Dashboard Venditore* per gestire i propri immobili.

---

## Note per l'Utilizzo

1. **Gestione del Database**:
   * Il backend è progettato con un sistema di **fallback trasparente** configurato in `DatabaseConfig.java`:
     * Se rileva un'istanza PostgreSQL locale attiva sulla porta standard `5432` con database `realestate_db`, utilizza la connessione PostgreSQL.
     * Se PostgreSQL **non** è in esecuzione (o Docker non è attivo), il backend **non va in crash**: attiva istantaneamente un database integrato H2 in modalità di compatibilità PostgreSQL (`MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE`), caricando automaticamente le 9 tabelle e gli 11 annunci di test con sconti e recensioni.
2. **Nessun Whitelabel Error Page su Spring Boot**:
   * Aprendo direttamente `http://localhost:8080/` o `http://localhost:8080`, Spring Boot non mostrerà la classica pagina di errore 404 bianca, bensì servirà direttamente la web application completa grazie a `HomeController.java`.
   * L'endpoint informativo sullo stato di tutte le API REST è consultabile su `http://localhost:8080/api`.
3. **Immagini degli Annunci e Protezione `onerror`**:
   * Tutte le immagini degli immobili utilizzano fotografie ad alta risoluzione da Unsplash.
   * È presente un gestore di fallback `onerror`: qualora un'immagine esterna fosse temporaneamente non raggiungibile o la macchina fosse offline, viene mostrata automaticamente un'immagine di riserva di alta qualità, evitando icone di foto spezzate.
4. **Mappa Geografica e Token Mapbox**:
   * Il layer cartografico Leaflet è integrato con il token Mapbox personale valido:
     `pk.eyJ1IjoibG9yZW56b2Jhc2lsZTAwNCIsImEiOiJjbXdjMmxhMGcwMHJ0MnpzODZzeWVtbTJlIn0.Kpba4zbJuQanvkO4UjJRiQ`.
   * La mappa supporta zoom, trascinamento, centratura dinamica sui marker delle coordinate dell'annuncio e selezione visiva della posizione nel form di creazione.
