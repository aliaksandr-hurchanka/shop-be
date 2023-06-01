-- users
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" VARCHAR ( 50 ) UNIQUE NOT NULL,
	"email" VARCHAR ( 255 ) UNIQUE,
	"password" VARCHAR ( 60 ) NOT NULL
);
INSERT INTO "users" ("id", "name", "email", "password") 
	VALUES 
	('1ae5f379-87c8-4c27-b36e-bbd10df2221f', 'Aliaksandr', 'alex@gmail.com', 'pass'), 
	('bb05ed83-cfcf-4690-a5e1-fd83f7b77edc', 'iam', null, 'user'),  
	('64704sac-3117-88bb-b312-8f246077d21z', 'whois', 'mail@gmail.com', 'pass');

-- carts
CREATE TABLE IF NOT EXISTS "carts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid REFERENCES "users" ("id") UNIQUE NOT NULL,
	"created_at" timestamp NOT NULL default now(),
	"updated_at" timestamp NOT NULL default now()
);
INSERT INTO "carts" ("id", "user_id", "created_at", "updated_at") 
	VALUES 
	('5f39884c-af73-4f02-be89-95eb7825c78e', '64704sac-3117-88bb-b312-8f246077d21z', current_timestamp, current_timestamp), 
	('107066ee-ee78-4188-b6ed-614c626579f4', '1ae5f379-87c8-4c27-b36e-bbd10df2221f', current_timestamp, current_timestamp); 

-- cart_items
CREATE TABLE IF NOT EXISTS "cart_items" (
	"cart_id" uuid REFERENCES "carts" ("id") NOT NULL,
	"product_id" uuid NOT NULL,
	"count" integer NOT NULL
);
INSERT INTO "cart_items" ("cart_id", "product_id", "count") 
	VALUES 
	('5f39884c-af73-4f02-be89-95eb7825c78e', '33eb1ac7-211e-46f1-9c10-fb27ab70da94', 3), 
	('107066ee-ee78-4188-b6ed-614c626579f4', '33eb1ac7-211e-46f1-9c10-fb27ab70da94', 6);

-- orders
CREATE TYPE "order_status" AS ENUM('paid', 'delivered');
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid REFERENCES "users" ("id"),
	"cart_id" uuid REFERENCES "carts" ("id"),
	"payment" JSON NOT NULL,
	"delivery" JSON NOT NULL,
	"comments" VARCHAR ( 255 ) NOT NULL,
	"status" order_status NOT NULL,
	"total" INTEGER NOT NULL
);
INSERT INTO "orders" ("id", "user_id", "cart_id", "payment", "delivery", "comments", "status", "total") 
	VALUES 
	('1bb2bb6c-be1d-49bf-add5-807b3fbaee6c', '64704sac-3117-88bb-b312-8f246077d21z', '5f39884c-af73-4f02-be89-95eb7825c78e', '{"type":"card"}', '{"type":"PTT","address":"Any Address"}', 'Please deliver the order to my office!', 'paid', 3211),
	('f8b4eceb-4317-40e0-99d4-47dc20ad1dd9', '1ae5f379-87c8-4c27-b36e-bbd10df2221f', '107066ee-ee78-4188-b6ed-614c626579f4', '{"type":"card"}', '{"type":"US Mail","address":"Any Address 2"}', 'Be careful please! It is a gift for my mom', 'delivered', 1333);
