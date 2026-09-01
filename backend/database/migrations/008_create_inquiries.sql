CREATE TABLE IF NOT EXISTS inquiries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT UNSIGNED NOT NULL,
    buyer_id BIGINT UNSIGNED NOT NULL,
    agent_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'read', 'responded', 'archived') NOT NULL DEFAULT 'pending',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_inquiry_property
        FOREIGN KEY (property_id)
        REFERENCES properties(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inquiry_buyer
        FOREIGN KEY (buyer_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inquiry_agent
        FOREIGN KEY (agent_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    INDEX idx_inquiry_buyer_updated (buyer_id, updated_at),
    INDEX idx_inquiry_agent_updated (agent_id, updated_at),
    INDEX idx_inquiry_property (property_id),
    INDEX idx_inquiry_status (status)
);
