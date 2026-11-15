-- ==============================================================================
-- Dati Iniziali
-- ==============================================================================

-- 1. UTENTI
-- Amministratore (requisito: esiste già un utente amministratore nel db)
INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_banned, created_at)
VALUES (1, 'superadmin@realestate.it', 'admin123', 'Lorenzo', 'Direttore', '+39 06 12345678', 'ADMIN', false, CURRENT_TIMESTAMP);

-- Venditori
INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_banned, created_at)
VALUES (2, 'monica.voci@realestate.it', 'seller123', 'Monica', 'Voci', '+39 347 1122334', 'SELLER', false, CURRENT_TIMESTAMP);

INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_banned, created_at)
VALUES (3, 'luigi.cozza@realestate.it', 'seller123', 'Luigi', 'Cozza', '+39 333 9988776', 'SELLER', false, CURRENT_TIMESTAMP);

-- Acquirenti
INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_banned, created_at)
VALUES (4, 'gennaro.guarino@email.it', 'buyer123', 'Gennaro', 'Guarino', '+39 320 5544332', 'BUYER', false, CURRENT_TIMESTAMP);

ALTER SEQUENCE users_id_seq RESTART WITH 10;

-- 2. CATEGORIE
INSERT INTO categories (id, name, description, icon) VALUES
(1, 'Appartamenti', 'Appartamenti residenziali, monolocali, bilocali e plurilocali in centro o periferia', 'bi-building'),
(2, 'Ville', 'Ville indipendenti con giardino privato, piscina e ampi spazi vivibili', 'bi-house-heart'),
(3, 'Box Auto', 'Garage singoli, doppi o posti auto coperti in autorimesse private', 'bi-car-front'),
(4, 'Terreni Edificabili', 'Lotti di terreno con concessione edilizia pronti per la costruzione', 'bi-geo-alt-fill'),
(5, 'Attici', 'Attici e superattici panoramici con ampi terrazzi a livello', 'bi-clouds');

ALTER SEQUENCE categories_id_seq RESTART WITH 10;

-- 3. IMMOBILI (ANNUNCI)
-- Annuncio 1: Appartamento Vendita a Roma con RIBASSO PREZZO (prezzo barrato: 320.000 -> 289.000)
INSERT INTO properties (id, seller_id, category_id, title, description, transaction_type, original_price, current_price, has_price_drop, square_meters, rooms, bathrooms, address, city, latitude, longitude, main_image_url, created_at, updated_at)
VALUES (
    1, 2, 1,
    'Luminoso Trilocale Ristrutturato con Terrazzo a Roma',
    'Splendido appartamento situato in zona Monteverde a Roma. Completamente ristrutturato nel 2024 con finiture di pregio, parquet in rovere, infissi a taglio termico e aria condizionata canalizzata. Ampio soggiorno living, cucina a vista, camera matrimoniale, cameretta, doppi servizi e favoloso terrazzo vivibile di 25 mq.',
    'SALE',
    320000.00,
    289000.00,
    true,
    95, 3, 2,
    'Via Fonteiana 45', 'Roma',
    41.8785000, 12.4542000,
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Annuncio 2: Villa Indipendente Vendita a Firenze con ASTA ATTIVA
INSERT INTO properties (id, seller_id, category_id, title, description, transaction_type, original_price, current_price, has_price_drop, square_meters, rooms, bathrooms, address, city, latitude, longitude, main_image_url, created_at, updated_at)
VALUES (
    2, 2, 2,
    'Elegante Villa sulle Colline Fiorentine con Parco e Piscina',
    'Prestigiosa villa unifamiliare immersa nel verde delle colline di Fiesole, con vista mozzafiato su Firenze. Parco recintato di 2.000 mq con uliveto e piscina panoramica. Salone triplo con camino in pietra serena, 4 camere da letto, 4 bagni, dépendance per gli ospiti e garage doppio. Oggetto di vendita all''asta con offerta di partenza vantaggiosa.',
    'SALE',
    750000.00,
    750000.00,
    false,
    340, 8, 4,
    'Via degli Ulivi 12', 'Firenze',
    43.8050000, 11.2980000,
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Annuncio 3: Appartamento in Affitto a Milano
INSERT INTO properties (id, seller_id, category_id, title, description, transaction_type, original_price, current_price, has_price_drop, square_meters, rooms, bathrooms, address, city, latitude, longitude, main_image_url, created_at, updated_at)
VALUES (
    3, 2, 1,
    'Moderno Bilocale Arredato in Porta Nuova / Isola a Milano',
    'In moderno stabile con portineria e ascensore, proponiamo in locazione bilocale completamente arredato a nuovo con mobili di design. Composto da ingresso, zona living con cucina a induzione, camera matrimoniale con cabina armadio, bagno con doccia walk-in e balcone. A pochi passi dalla metropolitana M5 e Bosco Verticale.',
    'RENT',
    1600.00,
    1450.00,
    true,
    60, 2, 1,
    'Via Gaetano de Castillia 18', 'Milano',
    45.4855000, 9.1912000,
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Annuncio 4: Box Auto Vendita a Torino
INSERT INTO properties (id, seller_id, category_id, title, description, transaction_type, original_price, current_price, has_price_drop, square_meters, rooms, bathrooms, address, city, latitude, longitude, main_image_url, created_at, updated_at)
VALUES (
    4, 3, 3,
    'Box Auto Singolo con Serranda Elettrica Zona Crocetta',
    'Ampio box auto di comodo accesso al piano seminterrato con rampa riscaldata antigelo. Serranda automatizzata con telecomando, impianto luce e presa elettrica privata ideale per ricarica scooter o e-bike. Misure: lunghezza 5,20m x larghezza 2,90m.',
    'SALE',
    35000.00,
    32000.00,
    true,
    18, 1, 0,
    'Corso Duca degli Abruzzi 24', 'Torino',
    45.0610000, 7.6620000,
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Annuncio 5: Terreno Edificabile a Bologna
INSERT INTO properties (id, seller_id, category_id, title, description, transaction_type, original_price, current_price, has_price_drop, square_meters, rooms, bathrooms, address, city, latitude, longitude, main_image_url, created_at, updated_at)
VALUES (
    5, 3, 4,
    'Terreno Edificabile Panoramico per Villa Singola o Bifamiliare',
    'Lotto di terreno pianeggiante di 1.200 mq con indice di edificabilità che consente la realizzazione di una superficie utile lorda di 350 mq. Già servito da acqua, luce, gas metano e fibra ottica a confine lotto. Posizione collinare ma comoda a tutti i servizi del paese.',
    'SALE',
    180000.00,
    180000.00,
    false,
    1200, 0, 0,
    'Via dei Colli 8', 'Bologna',
    44.4750000, 11.3200000,
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Annuncio 6: Attico in Affitto a Roma
INSERT INTO properties (id, seller_id, category_id, title, description, transaction_type, original_price, current_price, has_price_drop, square_meters, rooms, bathrooms, address, city, latitude, longitude, main_image_url, created_at, updated_at)
VALUES (
    6, 3, 1,
    'Splendido Attico Panoramico Arredato con Terrazzo a Roma',
    'Prestigioso attico arredato in elegante palazzo d''epoca con ascensore. Ampio salone doppio con camino, cucina all''americana completa di elettrodomestici, suite padronale con bagno privato e favoloso terrazzo panoramico a livello.',
    'RENT',
    2400.00,
    2200.00,
    true,
    110, 4, 2,
    'Via dei Coronari 28', 'Roma',
    41.9004000, 12.4705000,
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Annuncio 7: Villa in Affitto a Firenze
INSERT INTO properties (id, seller_id, category_id, title, description, transaction_type, original_price, current_price, has_price_drop, square_meters, rooms, bathrooms, address, city, latitude, longitude, main_image_url, created_at, updated_at)
VALUES (
    7, 2, 2,
    'Elegante Villa Unifamiliare con Parco e Piscina a Fiesole',
    'Esclusiva villa panoramica in locazione residenziale, immersa nelle colline fiorentine. Parco privato di 1.500 mq, piscina privata a sfioro, dépendance per custode, climatizzazione totale e videosorveglianza.',
    'RENT',
    4200.00,
    3800.00,
    true,
    280, 7, 3,
    'Via Belvedere 14', 'Firenze',
    43.8010000, 11.2950000,
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Annuncio 8: Box Auto in Affitto a Milano
INSERT INTO properties (id, seller_id, category_id, title, description, transaction_type, original_price, current_price, has_price_drop, square_meters, rooms, bathrooms, address, city, latitude, longitude, main_image_url, created_at, updated_at)
VALUES (
    8, 3, 3,
    'Posto Auto Coperto e Box in Garage Videosorvegliato a Milano',
    'Ampio box auto singolo per auto di grandi dimensioni o SUV in stabile signorile a 200 metri dalla Stazione Centrale. Accesso con cancello automatico telecomandato, corsia di manovra illuminata, punto presa ricarica elettrica.',
    'RENT',
    210.00,
    190.00,
    true,
    16, 1, 0,
    'Via Vittor Pisani 12', 'Milano',
    45.4808000, 9.2012000,
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Annuncio 9: Bilocale in Affitto a Bologna
INSERT INTO properties (id, seller_id, category_id, title, description, transaction_type, original_price, current_price, has_price_drop, square_meters, rooms, bathrooms, address, city, latitude, longitude, main_image_url, created_at, updated_at)
VALUES (
    9, 2, 1,
    'Luminoso Bilocale Ristrutturato per Studenti e Professionisti a Bologna',
    'Moderno bilocale nel cuore universitario di Bologna, completamente restaurato e arredato a nuovo. Composto da ingresso, zona living con cucina a induzione, camera matrimoniale, fibra ultraveloce, aria condizionata e cantina di pertinenza.',
    'RENT',
    900.00,
    850.00,
    true,
    48, 2, 1,
    'Via Zamboni 42', 'Bologna',
    44.4965000, 11.3524000,
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Annuncio 10: Trilocale in Vendita a Cosenza
INSERT INTO properties (id, seller_id, category_id, title, description, transaction_type, original_price, current_price, has_price_drop, square_meters, rooms, bathrooms, address, city, latitude, longitude, main_image_url, created_at, updated_at)
VALUES (
    10, 2, 1,
    'Trilocale Ristrutturato su Corso Mazzini a Cosenza',
    'Splendido appartamento situato nella prestigiosa isola pedonale di Corso Mazzini a Cosenza, nel cuore commerciale e culturale della città (MAB). Totalmente ristrutturato con ottime finiture, parquet moderno, infissi insonorizzati a taglio termico, riscaldamento autonomo, doppi servizi, cucina abitabile, due balconi panoramici e cantina.',
    'SALE',
    145000.00,
    129000.00,
    true,
    90, 3, 2,
    'Corso Mazzini 120', 'Cosenza',
    39.3015000, 16.2520000,
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1000&q=80',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Annuncio 11: Quadrilocale in Affitto a Cosenza
INSERT INTO properties (id, seller_id, category_id, title, description, transaction_type, original_price, current_price, has_price_drop, square_meters, rooms, bathrooms, address, city, latitude, longitude, main_image_url, created_at, updated_at)
VALUES (
    11, 3, 1,
    'Quadrilocale Arredato per Studenti e Famiglie vicino Unical / Centro',
    'Spazioso quadrilocale in locazione su Via Panebianco a Cosenza, ottimamente collegato sia con il centro cittadino che con il Campus Universitario della Calabria (Unical). Composto da salone luminoso, cucina abitabile con veranda, tre ampie camere, doppi servizi, termoautonomo, autoclave condominiale e posto auto in corte recintata con cancello elettrico.',
    'RENT',
    650.00,
    580.00,
    true,
    105, 4, 2,
    'Via Panebianco 88', 'Cosenza',
    39.3140000, 16.2460000,
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1000&q=80',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

ALTER SEQUENCE properties_id_seq RESTART WITH 20;

-- 4. GALLERIA IMMAGINI ACCESSORIE
INSERT INTO property_images (property_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
(1, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
(2, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'),
(3, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80');

-- 5. RECENSIONI (da acquirenti che hanno visitato l'immobile)
INSERT INTO reviews (property_id, buyer_id, rating, comment, has_visited, created_at) VALUES
(1, 4, 5, 'Ho visitato questo trilocale la settimana scorsa con l''agente. La ristrutturazione è impeccabile, i materiali sono ottimi e il terrazzo è ancora più spazioso dal vivo che in foto. Zona tranquilla e silenziosa.', true, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(1, 4, 4, 'Visita concordata velocemente. L''immobile corrisponde pienamente alla descrizione. Il prezzo scontato lo rende davvero molto competitivo nel quartiere.', true, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(2, 4, 5, 'Villa magnifica, vista panoramica straordinaria sul Duomo di Firenze. Rifiniture signorili.', true, CURRENT_TIMESTAMP - INTERVAL '5 days');

-- 6. ASTE ATTIVE
INSERT INTO auctions (id, property_id, starting_price, current_highest_bid, highest_bidder_id, start_date, end_date, is_active, created_at)
VALUES (
    1, 2, 700000.00, 725000.00, 4,
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    true, CURRENT_TIMESTAMP - INTERVAL '2 days'
);

ALTER SEQUENCE auctions_id_seq RESTART WITH 10;

-- 7. OFFERTE ASTA (Bids)
INSERT INTO bids (auction_id, buyer_id, bid_amount, bid_time) VALUES
(1, 4, 710000.00, CURRENT_TIMESTAMP - INTERVAL '1 day 10 hours'),
(1, 4, 725000.00, CURRENT_TIMESTAMP - INTERVAL '4 hours');

-- 8. MESSAGGI DI CONTATTO
INSERT INTO contact_messages (property_id, seller_id, buyer_id, subject, buyer_name, buyer_email, buyer_phone, message, created_at)
VALUES (
    1, 2, 4,
    'Richiesta informazioni per Annuncio #1: Luminoso Trilocale Ristrutturato con Terrazzo a Roma',
    'Gennaro Guarino', 'gennaro.guarino@email.it', '+39 320 5544332',
    'Gentile Monica, sono interessato a effettuare una seconda visita sabato mattina con il mio perito di fiducia. È possibile concordare un orario?',
    CURRENT_TIMESTAMP - INTERVAL '2 days'
),
(
    4, 3, 4,
    'Richiesta informazioni per Annuncio #4: Box Auto Singolo con Serranda Elettrica Zona Crocetta',
    'Gennaro Guarino', 'gennaro.guarino@email.it', '+39 320 5544332',
    'Gentile Luigi, il box auto è accessibile comodamente anche per un SUV di grandi dimensioni? Rimango in attesa di un riscontro, grazie.',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
);
