# Frontend Angular - Portale Immobiliare

Questo modulo implementa il frontend della piattaforma per annunci di affitto e vendita di immobili, sviluppato in **Angular** con interfaccia grafica **responsive** e integrazioni avanzate.

## Requisiti Soddisfatti

### 1. Interfaccia Responsive & Regole CSS Personalizzate
L'interfaccia si adatta a qualsiasi risoluzione (desktop, tablet, smartphone) tramite **Bootstrap 5** combinato a **regole CSS personalizzate** scritte a mano in `src/styles.css`:

1. `.price-strikethrough`: Effetto prezzo barrato con linea diagonale semi-trasparente rossa per evidenziare il vecchio prezzo a seguito del ribasso.
2. `.price-discount-tag`: Badge sfumato con gradiente arancione-rosso e animazione a impulsi per segnalare gli immobili scontati.
3. `.realestate-card-hover`: Transizione fluida 3D con elevazione verticale, ingrandimento fotografico progressivo e bordi luminescenti al passaggio del mouse.
4. `.auction-active-ribbon`: Nastro viola sfumato con icona a martelletto posizionato in alto a destra delle card per identificare le aste attive.
5. `.verified-visitor-badge`: Badge verde smeraldo che certifica che la recensione è stata redatta solo dopo aver effettuato il sopralluogo dell'immobile.
6. `.custom-map-container`: Contenitore mappa geolocalizzata con bordi arrotondati, ombra profonda e aspect-ratio responsive.
7. Media queries `@media (max-width: 768px)` per ottimizzazione su dispositivi mobili.

### 2. Librerie Esterne & API
- **Chart.js**: Grafico a barre interattivo dell'andamento dei prezzi medi al metro quadro per categoria (`PriceTrendsChartComponent`).
- **Google Maps / OpenStreetMap Geocoding**: Visualizzazione interattiva delle coordinate geografiche dell'immobile con marker pin.
- **Facebook Graph API**: Modale di condivisione e promozione dell'annuncio su pagine Facebook aziendali.

### 3. Ruoli Utente & Utenti di Prova
- **Super Amministratore**:
  - Utente già presente nel seed database: `superadmin@realestate.it` / `admin123` (**Lorenzo Direttore**).
  - Dashboard con moderazione e cancellazione totale di annunci e recensioni.
  - Bannare / riabilitare utenti e nominare altri utenti come amministratori.
- **Venditori**:
  - Utenti predefiniti: `monica.voci@realestate.it` / `seller123` (**Monica Voci**) e `luigi.cozza@realestate.it` / `seller123` (**Luigi Cozza**).
  - Creare (con locali, bagni, coordinate geografiche e mini-mappa), modificare, cancellare annunci.
  - **Ribassare il prezzo**: calcolo automatico e visualizzazione del vecchio prezzo barrato e nuovo prezzo scontato.
  - **Modulo di contatto**: ricezione messaggi di contatto aventi per oggetto `[ANN-ID] Titolo`.
  - **Aste**: creazione di aste competitive con offerta iniziale e gestione dei rilanci.
  - **Promozione Facebook**: pubblicazione tramite API sulla pagina Facebook.
  - Se nominati admin, continuano a visualizzare la Dashboard Venditore per gestire i propri annunci.
- **Acquirente**:
  - Utente predefinito: `gennaro.guarino@email.it` / `buyer123` (**Gennaro Guarino**).
  - Ricerca con filtri per Affitto/Vendita e tipologia (Appartamenti, Ville, Box auto, Terreni, ecc.).
  - Ordinamento per prezzo e/o metri quadri (ascendente e discendente).
  - **Scrivere recensioni**: consentito solo previa dichiarazione/verifica della visita dell'immobile (`hasVisited = true`).
  - Contattare il venditore compilando il form direttamente dalla scheda annuncio.
- **Ospite**:
  - Stato iniziale all'apertura dell'applicazione, visualizza solo il catalogo. Per scrivere ai venditori, recensire o fare offerte è richiesto l'accesso.

## Avvio del Frontend

```bash
cd frontend
npm install
npm start
```
L'applicazione sarà accessibile su `http://localhost:4200`.
