CREATE TABLE IF NOT EXISTS visit_bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT UNSIGNED NOT NULL,
    buyer_id BIGINT UNSIGNED NOT NULL,
    agent_id BIGINT UNSIGNED NOT NULL,
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    status ENUM('pending', 'approved', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_visit_property
        FOREIGN KEY (property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_visit_buyer
        FOREIGN KEY (buyer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_visit_agent
        FOREIGN KEY (agent_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_visit_buyer
    ON visit_bookings(buyer_id);

CREATE INDEX idx_visit_agent
    ON visit_bookings(agent_id);

CREATE INDEX idx_visit_property
    ON visit_bookings(property_id);

CREATE INDEX idx_visit_status
    ON visit_bookings(status);

CREATE INDEX idx_visit_date
    ON visit_bookings(visit_date);
