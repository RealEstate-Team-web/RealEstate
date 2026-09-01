CREATE TABLE IF NOT EXISTS inquiry_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    inquiry_id BIGINT UNSIGNED NOT NULL,
    sender_id BIGINT UNSIGNED NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inquiry_msg_inquiry
        FOREIGN KEY (inquiry_id)
        REFERENCES inquiries(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_inquiry_msg_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    INDEX idx_inquiry_msg_thread (inquiry_id, created_at, id),
    INDEX idx_inquiry_msg_sender (sender_id)
);
