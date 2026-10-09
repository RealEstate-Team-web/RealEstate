CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  plan_id BIGINT UNSIGNED NOT NULL,
  status ENUM('pending', 'active', 'expired', 'cancelled') NOT NULL DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'ETB',
  duration_days INT UNSIGNED NOT NULL,
  starts_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_subscriptions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_subscriptions_plan
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  INDEX idx_subscriptions_user (user_id),
  INDEX idx_subscriptions_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subscription_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  tx_ref VARCHAR(100) NOT NULL,
  provider VARCHAR(20) NOT NULL DEFAULT 'chapa',
  status ENUM('pending', 'success', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
  chapa_reference VARCHAR(100) NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'ETB',
  mode VARCHAR(10) NOT NULL DEFAULT 'test',
  failure_reason VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_payments_tx_ref UNIQUE (tx_ref),
  CONSTRAINT fk_payments_subscription
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
  CONSTRAINT fk_payments_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_payments_user (user_id),
  INDEX idx_payments_subscription (subscription_id),
  INDEX idx_payments_tx_ref (tx_ref)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;