-- ==============================================================================
-- Schema SQL per Portale Immobiliare
-- Database: PostgreSQL
-- Tabelle previste: users, categories, properties, property_images, reviews,
--                   contact_messages, auctions, bids, facebook_promotions (9 tabelle)
-- ==============================================================================

DROP TABLE IF EXISTS facebook_promotions CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS auctions CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Tabella UTENTI (Amministratori, Venditori, Acquirenti)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(30) NOT NULL CHECK (role IN ('ADMIN', 'SELLER', 'BUYER')),
    is_banned BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Tabella CATEGORIE IMMOBILI
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50)
);

-- 3. Tabella IMMOBILI (Annunci)
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('SALE', 'RENT')),
    original_price NUMERIC(12, 2) NOT NULL,
    current_price NUMERIC(12, 2) NOT NULL,
    has_price_drop BOOLEAN DEFAULT FALSE NOT NULL,
    square_meters INT NOT NULL CHECK (square_meters > 0),
    rooms INT DEFAULT 1,
    bathrooms INT DEFAULT 1,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    main_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Tabella IMMAGINI ACCESSORIE
CREATE TABLE property_images (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL
);

-- 5. Tabella RECENSIONI (Solo se ha visitato l'immobile)
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    buyer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    has_visited BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. Tabella MESSAGGI DI CONTATTO (Oggetto: [ID - Titolo])
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    seller_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    buyer_id INT REFERENCES users(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    buyer_name VARCHAR(150) NOT NULL,
    buyer_email VARCHAR(150) NOT NULL,
    buyer_phone VARCHAR(50),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. Tabella ASTE
CREATE TABLE auctions (
    id SERIAL PRIMARY KEY,
    property_id INT UNIQUE NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    starting_price NUMERIC(12, 2) NOT NULL,
    current_highest_bid NUMERIC(12, 2),
    highest_bidder_id INT REFERENCES users(id) ON DELETE SET NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. Tabella OFFERTE ASTA (Bids)
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    auction_id INT NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    buyer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bid_amount NUMERIC(12, 2) NOT NULL,
    bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 9. Tabella CONDIVISIONI / PROMOZIONI FACEBOOK API
CREATE TABLE facebook_promotions (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    facebook_post_id VARCHAR(255),
    target_page_name VARCHAR(150),
    post_content TEXT,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indici per velocizzare ricerche e ordinamenti richiesti
CREATE INDEX idx_properties_filters ON properties(transaction_type, category_id, current_price, square_meters);
CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_auctions_property ON auctions(property_id);
