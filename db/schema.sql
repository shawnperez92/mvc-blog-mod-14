DROP DATABASE IF EXISTS tech_blog_db;

CREATE DATABASE tech_blog_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tech_blog_db;

GRANT ALL PRIVILEGES ON tech_blog_db.* TO 'perez'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `bio` VARCHAR(255),
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `post` (
    `id` BIGINT AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `user_id` INTEGER REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `comment` (
    `id` SERIAL,
    `comment` VARCHAR(255) NOT NULL,
    `user_id` INTEGER REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    `post_id` INTEGER REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (`id`)
);