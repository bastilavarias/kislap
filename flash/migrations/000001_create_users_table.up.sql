CREATE TABLE `users` (
                         `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                         `first_name`    VARCHAR(255) NOT NULL,
                         `last_name`     VARCHAR(255) NOT NULL,
                         `email`         VARCHAR(255) NOT NULL UNIQUE,
                         `password`      VARCHAR(255) NOT NULL,
                         `mobile_number` VARCHAR(20) DEFAULT NULL,
                         `role`          VARCHAR(50) NOT NULL DEFAULT 'default',
                         `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
