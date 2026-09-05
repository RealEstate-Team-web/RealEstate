ALTER TABLE properties
    MODIFY COLUMN status ENUM(
        'draft',
        'available',
        'sold',
        'rented'
    ) NOT NULL DEFAULT 'available';