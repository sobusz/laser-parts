ALTER TABLE `users` ADD `passwordHash` varchar(255);--> statement-breakpoint
ALTER TABLE `products` ADD `orderNumber` varchar(255);--> statement-breakpoint
ALTER TABLE `products` ADD `sketchUrl` text;--> statement-breakpoint
ALTER TABLE `products` ADD `groupName` varchar(255);--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inquiryNumber` varchar(64) NOT NULL,
	`companyName` varchar(512) NOT NULL,
	`nip` varchar(32),
	`contactName` varchar(255) NOT NULL,
	`contactEmail` varchar(320) NOT NULL,
	`contactPhone` varchar(64),
	`notes` text,
	`status` enum('new','in_progress','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`),
	CONSTRAINT `inquiries_inquiryNumber_unique` UNIQUE(`inquiryNumber`)
);--> statement-breakpoint
CREATE TABLE `inquiry_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inquiryId` int NOT NULL,
	`productId` int,
	`productName` varchar(512) NOT NULL,
	`referenceNumber` varchar(255),
	`quantity` int NOT NULL,
	`note` text,
	CONSTRAINT `inquiry_items_id` PRIMARY KEY(`id`)
);--> statement-breakpoint
CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(512) NOT NULL,
	`excerpt` text,
	`body` text NOT NULL,
	`section` enum('technologia','optyka','nowosc','oprogramowanie','strona') NOT NULL,
	`published` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);--> statement-breakpoint
CREATE TABLE `used_machines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(512) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text,
	`contactNote` text,
	`active` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `used_machines_id` PRIMARY KEY(`id`),
	CONSTRAINT `used_machines_slug_unique` UNIQUE(`slug`)
);
