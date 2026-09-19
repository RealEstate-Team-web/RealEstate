-- Add CHECK constraints for subscription_plans (017 already applied)
ALTER TABLE subscription_plans
  ADD CONSTRAINT chk_subscription_plans_price CHECK (price >= 0),
  ADD CONSTRAINT chk_subscription_plans_duration CHECK (duration_days > 0),
  ADD CONSTRAINT chk_subscription_plans_property_limit CHECK (property_limit > 0),
  ADD CONSTRAINT chk_subscription_plans_images_per_property CHECK (images_per_property > 0),
  ADD CONSTRAINT chk_subscription_plans_is_active CHECK (is_active IN (0, 1));
