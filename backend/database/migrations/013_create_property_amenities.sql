CREATE TABLE IF NOT EXISTS property_amenities (
  property_id BIGINT UNSIGNED NOT NULL,
  amenity_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (property_id, amenity_id),
  CONSTRAINT fk_property_amenities_property
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT fk_property_amenities_amenity
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE,
  INDEX idx_property_amenities_amenity (amenity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
