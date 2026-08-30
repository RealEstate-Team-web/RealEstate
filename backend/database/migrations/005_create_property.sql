CREATE TABLE IF NOT EXISTS properties (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    agent_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,

    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,

    listing_type ENUM('sale', 'rent') NOT NULL,

    price DECIMAL(14,2) NOT NULL,

    bedrooms INT UNSIGNED NULL,
    bathrooms INT UNSIGNED NULL,
    parking_spaces INT UNSIGNED NULL,

    area DECIMAL(10,2) NULL,

    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255) NULL,

    latitude DECIMAL(10,7) NULL,
    longitude DECIMAL(10,7) NULL,

    status ENUM(
        'available',
        'sold',
        'rented'
    ) NOT NULL DEFAULT 'available',

    views INT UNSIGNED NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_property_agent
        FOREIGN KEY (agent_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_property_category
        FOREIGN KEY (category_id)
        REFERENCES property_categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_property_price
        CHECK (price > 0)
);


CREATE INDEX idx_properties_agent
    ON properties(agent_id);

CREATE INDEX idx_properties_category
    ON properties(category_id);

CREATE INDEX idx_properties_city
    ON properties(city);

CREATE INDEX idx_properties_listing_type
    ON properties(listing_type);

CREATE INDEX idx_properties_price
    ON properties(price);

CREATE INDEX idx_properties_bedrooms
    ON properties(bedrooms);

CREATE INDEX idx_properties_bathrooms
    ON properties(bathrooms);

CREATE INDEX idx_properties_area
    ON properties(area);

CREATE INDEX idx_properties_status
    ON properties(status);

CREATE INDEX idx_properties_created_at
    ON properties(created_at);