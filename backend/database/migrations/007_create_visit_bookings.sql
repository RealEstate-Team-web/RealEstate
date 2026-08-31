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
        ON DELETE CASCADE,

    INDEX idx_visit_buyer (buyer_id),
    INDEX idx_visit_agent (agent_id),
    INDEX idx_visit_status (status),
    INDEX idx_visit_date (visit_date),
    INDEX idx_visit_conflict (property_id, buyer_id, visit_date, visit_time)
);
