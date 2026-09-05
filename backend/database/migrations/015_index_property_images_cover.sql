-- Composite index covering the most common property-image lookups:
-- cover selection (list queries) and ordered gallery reads.
ALTER TABLE property_images
  ADD INDEX idx_property_images_property_cover (property_id, is_cover);

-- Drop the now-redundant single-column index that the composite covers.
ALTER TABLE property_images
  DROP INDEX idx_property_images_property;