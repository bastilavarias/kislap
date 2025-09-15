-- +migrate Up
CREATE TABLE IF NOT EXISTS `work_experiences` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `portfolio_id` BIGINT UNSIGNED NULL,

    `company` VARCHAR(255) NULL,
    `role` VARCHAR(255) NULL,
    `location` VARCHAR(255) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `about` TEXT NULL,

    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL DEFAULT NULL,

    FOREIGN KEY (portfolio_id) REFERENCES `portfolios`(id) ON DELETE SET NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;