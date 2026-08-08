-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: grocery_store
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cash_registers`
--

DROP TABLE IF EXISTS `cash_registers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_registers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employee_id` bigint unsigned NOT NULL,
  `opened_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `closed_at` timestamp NULL DEFAULT NULL,
  `expected_cash` decimal(10,2) NOT NULL DEFAULT '0.00',
  `actual_cash` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `opening_cash` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `cash_registers_employee_id_foreign` (`employee_id`),
  CONSTRAINT `cash_registers_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_registers`
--

LOCK TABLES `cash_registers` WRITE;
/*!40000 ALTER TABLE `cash_registers` DISABLE KEYS */;
INSERT INTO `cash_registers` VALUES (1,5,'2026-07-31 22:47:55','2026-07-31 22:48:27',500.00,850.00,'2026-07-31 22:47:55','2026-07-31 22:48:27',500.00),(2,5,'2026-07-31 22:49:21','2026-08-02 01:25:35',500.00,850.00,'2026-07-31 22:49:21','2026-08-02 01:25:35',500.00),(3,5,'2026-08-02 06:20:11','2026-08-02 06:20:57',500.00,850.00,'2026-08-02 06:20:11','2026-08-02 06:20:57',500.00),(4,5,'2026-08-02 06:28:18','2026-08-02 06:29:46',598.00,850.00,'2026-08-02 06:28:18','2026-08-02 06:29:46',500.00),(5,5,'2026-08-02 23:25:20',NULL,0.00,NULL,'2026-08-02 23:25:20','2026-08-02 23:25:20',500.00);
/*!40000 ALTER TABLE `cash_registers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Abarrotes','Productos básicos de despensa','2026-02-24 07:05:25','2026-02-24 07:05:25'),(2,'Bebidas','Bebidas frías y calientes','2026-02-24 07:05:25','2026-02-24 07:05:25'),(3,'Lácteos','Productos derivados de la leche','2026-02-24 07:05:25','2026-02-24 07:05:25'),(4,'Limpieza','Artículos de limpieza del hogar','2026-02-24 07:05:25','2026-02-24 07:05:25'),(5,'Botanas','Snacks y frituras','2026-02-24 07:05:25','2026-02-24 07:05:25'),(6,'Panadería','Pan fresco y repostería','2026-03-03 10:09:15','2026-03-03 10:09:15'),(7,'Frutas y Verduras','Productos del campo frescos','2026-03-03 10:09:15','2026-03-03 10:09:15'),(8,'Carnes y Embutidos','Cortes de carne y salchichonería','2026-03-03 10:09:15','2026-03-03 10:09:15'),(9,'Mascotas','Alimento y accesorios para animales','2026-03-03 10:09:15','2026-03-03 10:09:15'),(10,'Farmacia','Medicamentos básicos y aseo personal','2026-03-03 10:09:15','2026-03-03 10:09:15');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_debts`
--

DROP TABLE IF EXISTS `client_debts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_debts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint unsigned NOT NULL,
  `sale_id` bigint unsigned DEFAULT NULL,
  `start_date` date NOT NULL,
  `due_date` date NOT NULL,
  `balance_due` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','overdue') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_debts_client_id_foreign` (`client_id`),
  KEY `client_debts_sale_id_foreign` (`sale_id`),
  CONSTRAINT `client_debts_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `client_debts_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_debts`
--

LOCK TABLES `client_debts` WRITE;
/*!40000 ALTER TABLE `client_debts` DISABLE KEYS */;
INSERT INTO `client_debts` VALUES (1,1,NULL,'2026-08-01','2026-08-15',150.00,'paid','2026-03-03 10:09:49','2026-07-31 22:34:17','2026-07-31 22:34:17'),(2,9,7,'2026-03-03','2026-03-18',69.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(3,1,NULL,'2026-03-03','2026-03-10',150.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(4,2,NULL,'2026-03-03','2026-03-10',45.00,'paid','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(5,3,NULL,'2025-01-01','2025-01-15',200.00,'overdue','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(6,6,NULL,'2026-03-03','2026-04-02',500.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(7,7,NULL,'2026-03-03','2026-03-10',120.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(8,10,NULL,'2026-03-03','2026-03-10',35.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(9,8,NULL,'2026-03-03','2026-03-10',10.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(10,5,NULL,'2026-03-03','2026-03-10',95.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(11,1,NULL,'2026-08-01','2026-08-15',160.00,'pending','2026-07-31 22:32:28','2026-07-31 22:32:28',NULL);
/*!40000 ALTER TABLE `client_debts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street_1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `street_2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `neighborhood` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `credit_limit` decimal(10,2) DEFAULT '0.00',
  `current_debt` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'luis yahir','hernandez gonzalez','3319800229','luis_@gmail.com','colorado 163','Entre Calles AMERICA DE SUR,BALFATE','Hacienda Santa Fe',0.00,0.00,'2026-02-25 08:29:11','2026-02-25 08:29:11',NULL),(2,'Ana','García','3310002201','ana.g@email.com','Av. Juárez 500',NULL,'Centro',1000.00,0.00,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(3,'Carlos','López','3310002202','c.lopez@email.com','Calle Hidalgo 12','Int 4','Zapopan',500.00,0.00,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(4,'María','Rodríguez','3310002203','maria.r@email.com','Paseo de las Aves',NULL,'Bugambilias',2000.00,0.00,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(5,'Jorge','Martínez','3310002204','jorge.m@email.com','Calzada Independencia',NULL,'San Juan',0.00,0.00,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(6,'Elena','Torres','3310002205','elena.t@email.com','Av. México 1500',NULL,'Ladrón de Guevara',1500.00,0.00,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(7,'Ricardo','Sánchez','3310002206','ric.s@email.com','Sierra de Tapalpa',NULL,'Las Águilas',300.00,0.00,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(8,'Sofía','Ramírez','3310002207','sofia.ram@email.com','Avenida Vallarta',NULL,'Americana',0.00,0.00,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(9,'Fernando','Castro','3310002208','fer.c@email.com','López Mateos Sur',NULL,'Santa Ana',5000.00,0.00,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(10,'Laura','Vázquez','3310002209','laura.v@email.com','Niños Héroes',NULL,'Moderna',200.00,0.00,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(11,'Carlos','Ramírez','3319998888','carlos.ramirez@email.com','Av. Vallarta 1500',NULL,'Americana',0.00,0.00,'2026-07-31 22:22:46','2026-07-31 22:22:46',NULL),(12,'Carlos','Ramirez','3319998888','carlos.ramir55ez@email.com','Av. Vallarta 1500',NULL,'Americana',0.00,0.00,'2026-07-31 22:23:33','2026-07-31 22:24:29','2026-07-31 22:24:29'),(13,'Carlos','Ramirez','3319998888','carlos.ramirez123@email.com','Av. Vallarta 1500','Av. Vallarta 1500','Americana',0.00,0.00,'2026-07-31 22:24:04','2026-07-31 22:31:07','2026-07-31 22:31:07');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payroll_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `card_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payroll_id` (`payroll_id`),
  UNIQUE KEY `employees_email_unique` (`email`),
  UNIQUE KEY `employees_user_id_unique` (`user_id`),
  KEY `employees_role_id_foreign` (`role_id`),
  CONSTRAINT `employees_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `employees_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (2,2,2,'Rosa','Melano','rosa.cajera@tienda.com','3300002222',NULL,'CAJ-001',80.00,NULL,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(3,3,3,'Alberto','Macen','alberto.stock@tienda.com','3300003333',NULL,'ALM-001',85.00,NULL,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(5,4,1,'Yahir','Hernández','yahir@gmail.com',NULL,NULL,'ADM-002',NULL,NULL,'2026-03-03 10:21:10','2026-03-03 10:21:10',NULL),(6,5,3,'guillermo','esparza','guillermo@gmail.com','2233134678','colorado 163','Gui-0403',90.00,'123456789345','2026-03-05 05:52:40','2026-03-05 05:52:40',NULL),(7,6,1,'Yahir','García','yahir.garcia@example.com','3312345678','Av. Siempre Viva 123','EMP-1001',50.00,'CARD-001','2026-06-21 00:08:07','2026-06-21 00:08:07',NULL),(8,7,2,'Ana Maria','gutierres','ana.lopez@tienda.com','3312345678','Calle Falsa 123','EMP-010',80.00,'1234567890123456','2026-07-31 22:12:59','2026-07-31 22:17:17','2026-07-31 22:17:17'),(9,8,2,'Anónima','López','Anónima.lopez12@tienda.com','3312345678','Calle Falsa 123','EMP-011',75.00,'1234567890123456','2026-07-31 23:49:04','2026-07-31 23:49:04',NULL),(10,9,2,'Anónima','López','Anóniggma.lopez12@tienda.com','3312345678','Calle Falsa 123','EMP-013',75.00,'1234567890123456','2026-08-02 01:21:29','2026-08-02 01:21:59','2026-08-02 01:21:59');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_adjustments`
--

DROP TABLE IF EXISTS `inventory_adjustments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_adjustments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  `adjustment_type` enum('addition','subtraction') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `adjustment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inventory_adjustments_product_id_foreign` (`product_id`),
  CONSTRAINT `inventory_adjustments_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_adjustments`
--

LOCK TABLES `inventory_adjustments` WRITE;
/*!40000 ALTER TABLE `inventory_adjustments` DISABLE KEYS */;
INSERT INTO `inventory_adjustments` VALUES (1,6,5,'addition','Compra inicial','2026-03-03 10:09:49','2026-03-03 10:09:49','2026-06-19 22:23:45','2026-06-19 22:23:45'),(2,7,2,'subtraction','Producto dañado','2026-03-03 10:09:49','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(3,8,10,'addition','Reposición de stock','2026-03-03 10:09:49','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(4,9,3,'subtraction','Caducado','2026-03-03 10:09:49','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(5,10,20,'addition','Promoción especial','2026-03-03 10:09:49','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(6,6,3,'subtraction','Corrección de inventario','2026-03-03 10:09:49','2026-03-03 10:09:49','2026-06-19 22:27:17',NULL),(7,12,12,'addition','Pedido recibido','2026-03-03 10:09:49','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(8,13,1,'subtraction','Error en registro','2026-03-03 10:09:49','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(9,14,8,'addition','Sobrante en descarga','2026-03-03 10:09:49','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(10,15,2,'subtraction','Muestra gratis','2026-03-03 10:09:49','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(11,6,5,'addition','Reposición de stock','2026-06-19 16:26:39','2026-06-19 22:26:39','2026-06-19 22:26:39',NULL),(12,6,5,'addition','Reposición de stock','2026-06-19 16:31:51','2026-06-19 22:31:51','2026-06-19 22:31:51',NULL),(13,7,5,'addition','Reposición de stock','2026-06-19 16:32:00','2026-06-19 22:32:00','2026-06-19 22:32:00',NULL),(14,7,5,'addition','Reposición de stock','2026-06-19 16:33:11','2026-06-19 22:33:11','2026-06-19 22:33:11',NULL),(15,7,5,'addition','Reposición de stock','2026-06-22 03:06:12','2026-06-22 09:06:12','2026-06-22 09:14:04','2026-06-22 09:14:04'),(16,8,3,'subtraction','Corrección de inventario','2026-06-22 03:08:55','2026-06-22 09:08:55','2026-06-22 09:14:48','2026-06-22 09:14:48'),(17,8,45,'addition','Reposición de stock','2026-07-31 16:09:53','2026-07-31 22:09:53','2026-07-31 22:09:53',NULL),(18,8,3,'subtraction','Corrección de inventario','2026-07-31 16:10:24','2026-07-31 22:10:24','2026-07-31 22:12:13','2026-07-31 22:12:13'),(19,8,3,'subtraction','Corrección de inventario','2026-08-01 19:20:04','2026-08-02 01:20:04','2026-08-02 01:20:50','2026-08-02 01:20:50');
/*!40000 ALTER TABLE `inventory_adjustments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_contents`
--

DROP TABLE IF EXISTS `media_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_contents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `section` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_contents`
--

LOCK TABLES `media_contents` WRITE;
/*!40000 ALTER TABLE `media_contents` DISABLE KEYS */;
/*!40000 ALTER TABLE `media_contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2026_06_08_064833_create_personal_access_tokens_table',1),(2,'0001_01_01_000000_create_users_table',2),(3,'0001_01_01_000001_create_cache_table',3),(4,'0001_01_01_000002_create_jobs_table',1),(5,'2026_02_22_023623_add_user_id_to_employees_table',1),(6,'2026_03_03_093326_create_media_contents_table',1),(7,'2026_03_07_004216_add_soft_deletes_to_tables',1),(8,'2026_06_09_011212_add_package_fields_to_products_table',1),(9,'2026_06_10_165819_add_mixed_payment_fields_to_sales_table',4),(10,'2026_06_10_165819_create_cash_registers_table',4),(11,'2026_06_10_165819_create_provider_funds_table',4),(12,'2026_06_10_165819_create_supplier_notes_table',4),(13,'2026_06_15_031704_add_package_fields_to_products_table',5),(14,'2026_06_15_033842_add_weight_fields_to_sales_table',6),(15,'2026_06_16_151902_add_status_to_sales_table',7),(16,'2026_06_19_161021_add_deleted_at_to_inventory_adjustments_table',8),(17,'2026_07_29_025301_add_cash_register_id_to_sales_table',9),(18,'2026_07_29_025301_add_opening_cash_to_cash_registers_table',9),(19,'2026_07_31_171129_add_soft_deletes_to_suppliers_table',10),(20,'2026_08_01_174049_add_sale_group_id_to_sales_table',11),(21,'2026_08_02_071811_add_observations_to_supplier_notes_table',12);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',4,'auth-token','7428194cdc0ce6e42620586827d28a3557f01296b6750097e6449366aa72d3ae','[\"*\"]',NULL,NULL,'2026-06-12 06:50:41','2026-06-12 06:50:41'),(2,'App\\Models\\User',4,'auth-token','14c8b5e82b9ecc71b735a19c1f7ab7a4dd1b1c43e475f304d17352171eec46ac','[\"*\"]','2026-06-12 07:33:20',NULL,'2026-06-12 07:31:34','2026-06-12 07:33:20'),(3,'App\\Models\\User',4,'auth-token','f41f8a22869ad24b9e38fafd575e3bf8a3b8ace68fd543ae1e59c02f57aec383','[\"*\"]','2026-06-12 07:48:14',NULL,'2026-06-12 07:46:07','2026-06-12 07:48:14'),(4,'App\\Models\\User',4,'auth-token','ff5077f4ccc202a57db5be67dcd3cfe17865da81730a95777e37be0102300570','[\"*\"]',NULL,NULL,'2026-06-15 22:10:38','2026-06-15 22:10:38'),(5,'App\\Models\\User',4,'auth-token','237ddd4f503fa50ce1851c0a2ae23a46148e3c07e332acfc3b7e4fdf3b0f5d80','[\"*\"]',NULL,NULL,'2026-06-15 22:17:17','2026-06-15 22:17:17'),(6,'App\\Models\\User',4,'auth-token','da7377002680bc0d5b77499b8947f777a2dcfe357a2088ae52170ba09a10a7e9','[\"*\"]','2026-06-16 21:27:36',NULL,'2026-06-15 22:20:05','2026-06-16 21:27:36'),(7,'App\\Models\\User',4,'auth-token','1e6e17532513b4f41c53e804fc23e66ed581926601fbf46dce61dd0c26c7454b','[\"*\"]','2026-06-19 21:56:16',NULL,'2026-06-19 21:53:53','2026-06-19 21:56:16'),(8,'App\\Models\\User',4,'auth-token','309b395652bd5ce3c6d802b4da9813c4b30fd892203a88df9d4d13ee04ed4ad8','[\"*\"]',NULL,NULL,'2026-06-19 21:55:06','2026-06-19 21:55:06'),(9,'App\\Models\\User',4,'auth-token','0d2f50fe8bfca01b266d80cd12f0efcad834ac996db1c614d0ccee75e0df954e','[\"*\"]','2026-06-21 00:09:00',NULL,'2026-06-19 22:00:52','2026-06-21 00:09:00'),(10,'App\\Models\\User',4,'auth-token','76d9eefbf41a290e23dd434d865f3270ca32267a10fb863844af795dbde94ac5','[\"*\"]',NULL,NULL,'2026-06-21 00:09:29','2026-06-21 00:09:29'),(11,'App\\Models\\User',4,'auth-token','c9240cb4ebdc9381e2d99f92f3b306654224a837c09c8bb1ed3f16253fc3469d','[\"*\"]',NULL,NULL,'2026-06-21 00:10:03','2026-06-21 00:10:03'),(12,'App\\Models\\User',4,'auth-token','486afc80505ca84aae9aa70cc98dd51848d46f73bac84b9a483f85b97f8d010b','[\"*\"]',NULL,NULL,'2026-06-21 00:10:09','2026-06-21 00:10:09'),(13,'App\\Models\\User',4,'auth-token','2a5bb5c9960e5fcb8fd87025dc694f5d9df8f4f63d63e793e0cdd541ab65b6ea','[\"*\"]','2026-07-30 22:38:24',NULL,'2026-06-22 09:05:34','2026-07-30 22:38:24'),(14,'App\\Models\\User',4,'auth-token','805653324a5e07af3e39f436f9cdbc4e080845b3a19b34ec28a5043f86abe9bc','[\"*\"]','2026-08-02 23:58:04',NULL,'2026-07-31 21:58:50','2026-08-02 23:58:04'),(15,'App\\Models\\User',4,'auth-token','f76d4ba78385d93a8bed2a03f27df8cc2e738d5fdaff59780dd826357f88b18f','[\"*\"]',NULL,NULL,'2026-08-02 06:37:43','2026-08-02 06:37:43'),(16,'App\\Models\\User',4,'auth-token','d4da47fba72b62567cb50e7264bbdde61648d991e9e5fc0e062a892e3b6bb241','[\"*\"]',NULL,NULL,'2026-08-02 06:39:00','2026-08-02 06:39:00'),(17,'App\\Models\\User',4,'auth-token','9dceceb4abfc932c2f1a76bfd148a638bd43a5bff421a7d66c1eff02df3fc543','[\"*\"]',NULL,NULL,'2026-08-02 06:39:11','2026-08-02 06:39:11'),(18,'App\\Models\\User',4,'auth-token','de48d038dc44203f33c591dbc575d63089f8e648ec7bd5c1bf4ef156fa82e26f','[\"*\"]',NULL,NULL,'2026-08-02 06:39:17','2026-08-02 06:39:17');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned DEFAULT NULL,
  `supplier_id` bigint unsigned DEFAULT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `barcode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `min_stock` int NOT NULL DEFAULT '5',
  `purchase_price` decimal(10,2) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `package_size` int DEFAULT NULL,
  `stock_in_units` int DEFAULT NULL,
  `price_per_unit` decimal(10,2) DEFAULT NULL,
  `price_per_package` decimal(10,2) DEFAULT NULL,
  `allows_unit_sale` tinyint(1) NOT NULL DEFAULT '0',
  `allows_package_sale` tinyint(1) NOT NULL DEFAULT '0',
  `allows_weight_sale` tinyint(1) NOT NULL DEFAULT '0',
  `price_per_kg` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_barcode_unique` (`barcode`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_supplier_id_foreign` (`supplier_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (6,1,1,'Arroz Súper Extra 1kg','Arroz blanco de grano largo, ideal para comidas diarias.','7501001234561',97,5,12.50,18.00,'2026-02-24 07:06:34','2026-08-02 23:26:26',NULL,NULL,NULL,NULL,NULL,0,0,0,0.00),(7,1,2,'Frijol Negro 1kg','Frijol negro limpio y seleccionado, alta calidad.','7503001122334',50,5,18.00,26.00,'2026-02-24 07:06:34','2026-06-22 09:14:04',NULL,NULL,NULL,NULL,NULL,0,0,0,0.00),(8,2,3,'Aceite Vegetal 900ml','Aceite vegetal comestible, perfecto para freír y cocinar.','7502009876543',75,5,22.00,32.00,'2026-02-24 07:06:34','2026-08-02 01:20:50',NULL,NULL,NULL,NULL,NULL,0,0,0,0.00),(9,3,4,'Leche Entera 1L','Leche entera pasteurizada, marca económica.','7506004455667',45,5,17.00,23.00,'2026-02-24 07:06:34','2026-02-24 07:06:34',NULL,NULL,NULL,NULL,NULL,0,0,0,0.00),(10,5,5,'Papas Fritas 150g','Botana salada crujiente, sabor clásico.','7507009988771',58,5,12.00,14.00,'2026-02-24 07:06:34','2026-08-02 07:14:54',NULL,NULL,NULL,NULL,NULL,0,0,0,0.00),(11,6,6,'Pan Integral Grande','Pan de caja con granos enteros','7501001100220',16,5,35.00,48.00,'2026-03-03 10:09:49','2026-08-02 23:27:35',NULL,NULL,NULL,NULL,NULL,0,0,0,0.00),(12,2,7,'Coca Cola 2.5L','Refresco de cola original','7501055303671',96,10,28.00,38.00,'2026-03-03 10:09:49','2026-08-02 23:26:26',NULL,NULL,NULL,NULL,NULL,0,0,0,0.00),(13,8,8,'Jamón de Pavo 500g','Jamón virginia de pavo','7501040001234',25,5,45.00,65.00,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL,NULL,NULL,NULL,NULL,0,0,0,0.00),(14,4,9,'Detergente Ariel 1kg','Jabón en polvo para ropa','7501234567890',40,5,25.00,35.00,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL,NULL,NULL,NULL,NULL,0,0,0,0.00),(15,3,10,'Yogurt Natural 1kg','Yogurt sin azúcar','7501112223334',15,5,22.00,32.00,'2026-03-03 10:09:49','2026-03-03 10:09:49',NULL,NULL,NULL,NULL,NULL,0,0,0,0.00),(17,1,NULL,'Coca Cola 600ml','Refresco sabor cola (actualizado)','750123457686588770',60,5,12.00,19.00,'2026-06-24 05:49:58','2026-06-24 06:53:06',NULL,1,60,19.00,19.00,1,0,0,0.00),(18,1,NULL,'Coca Cola 600ml','Refresco sabor cola','7501234345467890',50,5,12.00,18.50,'2026-06-24 06:48:23','2026-06-24 06:49:44',NULL,1,50,18.50,18.50,1,0,0,0.00),(20,1,NULL,'Coca Cola 600ml','Refresco sabor cola (actualizado)','454343534345467890',60,5,12.00,19.00,'2026-07-31 22:00:35','2026-08-02 01:04:47',NULL,1,60,19.00,19.00,1,0,0,0.00),(21,1,NULL,'Coca Cola 600ml','Refresco sabor cola (actualizado)','750343534345467890',60,5,12.00,19.00,'2026-08-02 01:02:32','2026-08-02 01:04:18',NULL,1,60,19.00,19.00,1,0,0,0.00);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provider_funds`
--

DROP TABLE IF EXISTS `provider_funds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provider_funds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `defined_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `extraction_limit` decimal(10,2) NOT NULL DEFAULT '0.00',
  `available_balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `provider_funds_created_by_foreign` (`created_by`),
  CONSTRAINT `provider_funds_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provider_funds`
--

LOCK TABLES `provider_funds` WRITE;
/*!40000 ALTER TABLE `provider_funds` DISABLE KEYS */;
INSERT INTO `provider_funds` VALUES (1,5000.00,2000.00,4000.00,NULL,'2026-07-30 06:57:22','2026-08-02 01:25:45');
/*!40000 ALTER TABLE `provider_funds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador','Acceso completo al sistema','2026-02-22 16:11:35','2026-02-22 16:11:35'),(2,'Cajero','Realizar ventas y gestionar clientes','2026-02-22 16:11:35','2026-02-22 16:11:35'),(3,'Almacenista','Gestionar inventario y productos','2026-02-22 16:11:35','2026-02-22 16:11:35'),(5,'Supervisor','Encargado de supervisar operaciones','2026-06-22 10:27:38','2026-06-22 10:27:38');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_details`
--

DROP TABLE IF EXISTS `sale_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sale_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sale_details_sale_id_foreign` (`sale_id`),
  KEY `sale_details_product_id_foreign` (`product_id`),
  CONSTRAINT `sale_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `sale_details_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_details`
--

LOCK TABLES `sale_details` WRITE;
/*!40000 ALTER TABLE `sale_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `sale_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sale_group_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `client_id` bigint unsigned DEFAULT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  `sale_unit_type` enum('unit','package','weight') COLLATE utf8mb4_unicode_ci DEFAULT 'unit',
  `total_price` decimal(10,2) NOT NULL,
  `cash_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `card_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `change_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `sale_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_method` enum('cash','card','credit','mixed') COLLATE utf8mb4_unicode_ci DEFAULT 'cash',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `status` enum('completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
  `cash_register_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_employee_id_foreign` (`employee_id`),
  KEY `sales_client_id_foreign` (`client_id`),
  KEY `sales_product_id_foreign` (`product_id`),
  KEY `sales_cash_register_id_foreign` (`cash_register_id`),
  KEY `sales_sale_group_id_index` (`sale_group_id`),
  CONSTRAINT `sales_cash_register_id_foreign` FOREIGN KEY (`cash_register_id`) REFERENCES `cash_registers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sales_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sales_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `sales_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,NULL,2,1,6,2,'unit',36.00,0.00,0.00,0.00,'2026-03-03 10:09:49','cash','2026-03-03 10:09:49','2026-06-16 21:27:33',NULL,NULL,'completed',NULL),(2,NULL,2,2,12,1,'unit',38.00,0.00,0.00,0.00,'2026-03-03 10:09:49','card','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL,NULL,'completed',NULL),(3,NULL,2,3,7,1,'unit',26.00,0.00,0.00,0.00,'2026-03-03 10:09:49','cash','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL,NULL,'completed',NULL),(4,NULL,2,4,13,1,'unit',65.00,0.00,0.00,0.00,'2026-03-03 10:09:49','credit','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL,NULL,'completed',NULL),(5,NULL,2,NULL,11,1,'unit',48.00,0.00,0.00,0.00,'2026-03-03 10:09:49','cash','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL,NULL,'cancelled',NULL),(6,NULL,2,6,8,2,'unit',64.00,0.00,0.00,0.00,'2026-03-03 10:09:49','cash','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL,NULL,'completed',NULL),(7,NULL,2,9,9,3,'unit',69.00,0.00,0.00,0.00,'2026-03-03 10:09:49','credit','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL,NULL,'completed',NULL),(8,NULL,2,NULL,10,5,'unit',90.00,0.00,0.00,0.00,'2026-03-03 10:09:49','cash','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL,NULL,'completed',NULL),(9,NULL,2,10,14,1,'unit',35.00,0.00,0.00,0.00,'2026-03-03 10:09:49','card','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL,NULL,'cancelled',NULL),(10,NULL,2,1,15,1,'unit',32.00,0.00,0.00,0.00,'2026-03-03 10:09:49','cash','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL,NULL,'completed',NULL),(11,NULL,5,NULL,6,2,'unit',36.00,0.00,0.00,0.00,'2026-07-31 16:05:58','cash','2026-07-31 22:05:58','2026-07-31 22:05:58',NULL,NULL,'completed',NULL),(12,NULL,5,NULL,6,3,'unit',54.00,0.00,0.00,0.00,'2026-07-31 16:06:32','cash','2026-07-31 22:06:32','2026-07-31 22:08:27','2026-07-31 22:08:27',NULL,'completed',NULL),(13,NULL,5,NULL,6,2,'unit',36.00,0.00,0.00,0.00,'2026-08-01 19:06:58','cash','2026-08-02 01:06:58','2026-08-02 01:06:58',NULL,NULL,'completed',NULL),(14,NULL,5,NULL,6,1,'unit',18.00,0.00,0.00,0.00,'2026-08-01 19:07:20','card','2026-08-02 01:07:20','2026-08-02 01:07:20',NULL,NULL,'completed',NULL),(15,NULL,5,NULL,12,1,'unit',38.00,0.00,0.00,0.00,'2026-08-01 19:07:20','card','2026-08-02 01:07:20','2026-08-02 01:07:20',NULL,NULL,'completed',NULL),(16,NULL,5,NULL,6,2,'unit',36.00,0.00,0.00,0.00,'2026-08-01 19:08:16','cash','2026-08-02 01:08:16','2026-08-02 01:08:16',NULL,NULL,'completed',NULL),(17,NULL,5,NULL,6,2,'unit',36.00,0.00,0.00,0.00,'2026-08-01 19:10:55','cash','2026-08-02 01:10:55','2026-08-02 01:19:46','2026-08-02 01:19:46',NULL,'completed',NULL),(18,NULL,5,NULL,6,1,'unit',18.00,0.00,0.00,0.00,'2026-08-01 19:16:42','mixed','2026-08-02 01:16:42','2026-08-02 01:16:42',NULL,NULL,'completed',NULL),(20,'86798cda-ba57-4c52-903f-b8b9e58a486e',5,NULL,10,1,'unit',14.00,2.00,12.00,0.00,'2026-08-01 19:53:52','mixed','2026-08-02 01:53:52','2026-08-02 02:16:43',NULL,NULL,'completed',1),(21,'86798cda-ba57-4c52-903f-b8b9e58a486e',5,NULL,10,1,'unit',14.00,2.00,12.00,8.00,'2026-08-01 19:53:52','mixed','2026-08-02 01:53:52','2026-08-02 02:16:43',NULL,NULL,'completed',1),(22,'02110b7d-ae2c-4dc3-b8a3-c632dd6517a4',5,NULL,6,1,'unit',18.00,0.00,18.16,0.00,'2026-08-01 19:55:36','card','2026-08-02 01:55:36','2026-08-02 01:57:00',NULL,NULL,'cancelled',1),(23,'02110b7d-ae2c-4dc3-b8a3-c632dd6517a4',5,NULL,12,1,'unit',38.00,0.00,38.34,0.50,'2026-08-01 19:55:36','card','2026-08-02 01:55:36','2026-08-02 01:57:00',NULL,NULL,'cancelled',1),(24,'91f99b7e-9038-4ce8-82b5-033be9a1a701',5,NULL,6,1,'unit',18.00,0.00,18.00,0.00,'2026-08-02 00:07:50','card','2026-08-02 06:07:50','2026-08-02 06:14:48',NULL,NULL,'cancelled',1),(25,'91f99b7e-9038-4ce8-82b5-033be9a1a701',5,NULL,10,1,'unit',14.00,0.00,14.00,42.00,'2026-08-02 00:07:50','card','2026-08-02 06:07:50','2026-08-02 06:16:20',NULL,NULL,'cancelled',1),(26,'8bd14457-6015-4212-8b2b-8312742da2f1',5,NULL,11,2,'unit',96.00,98.00,0.00,2.00,'2026-08-02 00:29:08','cash','2026-08-02 06:29:08','2026-08-02 06:29:08',NULL,NULL,'completed',4),(27,'fcec822b-210f-4ff5-bd52-c97b6045aacc',5,NULL,11,2,'unit',96.00,96.00,0.00,2.00,'2026-08-02 17:25:28','cash','2026-08-02 23:25:28','2026-08-02 23:25:28',NULL,NULL,'completed',5),(28,'dd24e093-e7fb-40d6-bfe0-2f600eb2ba67',5,NULL,6,1,'unit',18.00,8.36,9.64,0.00,'2026-08-02 17:26:23','mixed','2026-08-02 23:26:23','2026-08-02 23:26:23',NULL,NULL,'completed',5),(29,'dd24e093-e7fb-40d6-bfe0-2f600eb2ba67',5,NULL,12,1,'unit',38.00,17.64,20.36,4.00,'2026-08-02 17:26:23','mixed','2026-08-02 23:26:23','2026-08-02 23:26:23',NULL,NULL,'completed',5),(30,'16599881-19d7-43b2-9ea7-b148dc9b2988',5,NULL,6,1,'unit',18.00,8.36,9.64,0.00,'2026-08-02 17:26:26','mixed','2026-08-02 23:26:26','2026-08-02 23:26:26',NULL,NULL,'completed',5),(31,'16599881-19d7-43b2-9ea7-b148dc9b2988',5,NULL,12,1,'unit',38.00,17.64,20.36,4.00,'2026-08-02 17:26:26','mixed','2026-08-02 23:26:26','2026-08-02 23:26:26',NULL,NULL,'completed',5),(32,'6ee27457-175d-47e1-bc55-52814be1c830',5,NULL,11,2,'unit',96.00,96.00,0.00,2.00,'2026-08-02 17:27:35','cash','2026-08-02 23:27:35','2026-08-02 23:27:35',NULL,NULL,'completed',5);
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('K3oaaFxNo50KZLl5HwBdzu8Wj8w1Lok3bA8jXRj2',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.131.0 Chrome/148.0.7778.280 Electron/42.7.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoibkp4WDd5V0N4bHVlMUNqS0NEVGRka2hzYnNyQUFNZGFBZ2xhd2F1biI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1785610838);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_debts`
--

DROP TABLE IF EXISTS `supplier_debts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_debts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `supplier_id` bigint unsigned NOT NULL,
  `start_date` date NOT NULL,
  `due_date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','overdue') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_debts_supplier_id_foreign` (`supplier_id`),
  CONSTRAINT `supplier_debts_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_debts`
--

LOCK TABLES `supplier_debts` WRITE;
/*!40000 ALTER TABLE `supplier_debts` DISABLE KEYS */;
INSERT INTO `supplier_debts` VALUES (1,1,'2026-03-03','2026-04-02',5000.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(2,2,'2026-03-03','2026-04-02',1200.50,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(3,3,'2026-03-03','2026-03-18',3400.00,'paid','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(4,6,'2026-03-03','2026-03-18',890.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(5,7,'2026-03-03','2026-03-18',2500.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(6,8,'2026-03-03','2026-04-02',4100.00,'overdue','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(7,9,'2026-03-03','2026-04-02',1500.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(8,10,'2026-03-03','2026-03-18',600.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(9,4,'2026-03-03','2026-04-02',2300.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(10,5,'2026-03-03','2026-04-02',1100.00,'pending','2026-03-03 10:09:49','2026-03-03 10:09:49',NULL),(11,1,'2026-08-01','2026-08-30',2500.00,'pending','2026-07-31 22:40:37','2026-07-31 22:40:37',NULL),(12,1,'2026-08-01','2026-08-30',2500.00,'paid','2026-07-31 22:41:31','2026-07-31 22:42:49','2026-07-31 22:42:49'),(13,1,'2026-08-01','2026-08-30',2500.00,'paid','2026-07-31 23:20:55','2026-07-31 23:21:27',NULL);
/*!40000 ALTER TABLE `supplier_debts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_note_details`
--

DROP TABLE IF EXISTS `supplier_note_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_note_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `supplier_note_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity_agreed` int NOT NULL,
  `quantity_received` int DEFAULT NULL,
  `price_agreed` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_gift` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_note_details_supplier_note_id_foreign` (`supplier_note_id`),
  KEY `supplier_note_details_product_id_foreign` (`product_id`),
  CONSTRAINT `supplier_note_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `supplier_note_details_supplier_note_id_foreign` FOREIGN KEY (`supplier_note_id`) REFERENCES `supplier_notes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_note_details`
--

LOCK TABLES `supplier_note_details` WRITE;
/*!40000 ALTER TABLE `supplier_note_details` DISABLE KEYS */;
INSERT INTO `supplier_note_details` VALUES (2,2,6,10,10,12.50,0.00,0,'2026-07-31 22:44:01','2026-08-02 01:25:05'),(3,3,6,10,10,12.50,0.00,0,'2026-08-01 08:43:08','2026-08-01 08:49:17'),(5,5,6,10,8,12.50,0.00,0,'2026-08-02 13:30:43','2026-08-02 13:31:33'),(6,6,6,10,8,12.50,0.00,0,'2026-08-02 13:36:40','2026-08-02 13:37:08'),(7,7,6,10,8,12.50,0.00,0,'2026-08-02 13:45:56','2026-08-02 13:46:12'),(8,8,6,10,8,12.50,0.00,0,'2026-08-02 13:48:45','2026-08-02 13:50:32');
/*!40000 ALTER TABLE `supplier_note_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_notes`
--

DROP TABLE IF EXISTS `supplier_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `supplier_id` bigint unsigned NOT NULL,
  `status` enum('pending','confirmed','paid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `delivery_date` date DEFAULT NULL,
  `anticipated_ticket_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delivery_ticket_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reminders` text COLLATE utf8mb4_unicode_ci,
  `observations` text COLLATE utf8mb4_unicode_ci,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `confirmed_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_notes_supplier_id_foreign` (`supplier_id`),
  KEY `supplier_notes_created_by_foreign` (`created_by`),
  KEY `supplier_notes_confirmed_by_foreign` (`confirmed_by`),
  CONSTRAINT `supplier_notes_confirmed_by_foreign` FOREIGN KEY (`confirmed_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  CONSTRAINT `supplier_notes_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  CONSTRAINT `supplier_notes_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_notes`
--

LOCK TABLES `supplier_notes` WRITE;
/*!40000 ALTER TABLE `supplier_notes` DISABLE KEYS */;
INSERT INTO `supplier_notes` VALUES (2,1,'confirmed',500.00,'2026-08-15',NULL,NULL,'Actualizado',NULL,NULL,5,5,'2026-07-31 22:44:01','2026-08-02 01:25:05'),(3,1,'paid',500.00,'2026-08-15',NULL,NULL,'Llamar antes de entregar',NULL,NULL,5,5,'2026-08-01 08:43:08','2026-08-02 01:25:13'),(5,1,'confirmed',500.00,'2026-08-15',NULL,NULL,'Llamar antes de entregar','El proveedor solo trajo 8 de los 10 acordados, dijo que no tenía existencia y que completa la próxima semana.','2026-08-02 13:31:33',5,5,'2026-08-02 13:30:43','2026-08-02 13:31:33'),(6,1,'confirmed',500.00,'2026-08-15',NULL,NULL,'Llamar antes de entregar','El proveedor solo trajo 8 de los 10 acordados, dijo que no tenía existencia y que completa la próxima semana.','2026-08-02 13:37:08',5,5,'2026-08-02 13:36:40','2026-08-02 13:37:08'),(7,1,'confirmed',500.00,'2026-08-15',NULL,NULL,'Llamar antes de entregar','El proveedor solo trajo 8 de los 10 acordados, dijo que no tenía existencia y que completa la próxima semana.','2026-08-02 13:46:12',5,5,'2026-08-02 13:45:56','2026-08-02 13:46:12'),(8,1,'confirmed',500.00,'2026-08-15',NULL,NULL,'Llamar antes de entregar','El proveedor solo trajo 8 de los 10 acordados, dijo que no tenía existencia y que completa la próxima semana.','2026-08-02 13:50:32',5,5,'2026-08-02 13:48:45','2026-08-02 13:50:32');
/*!40000 ALTER TABLE `supplier_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'Distribuidora Diconsa','María López','555-123-4567','contacto@diconsa.mx','2026-02-24 07:06:21','2026-02-24 07:06:21',NULL),(2,'Abarrotera La Central','Jorge Ramírez','333-987-6543','ventas@lacentral.com','2026-02-24 07:06:21','2026-02-24 07:06:21',NULL),(3,'Abarrotera del Pacífico','Ana Torres','662-555-8899','contacto@pacifico.com','2026-02-24 07:06:21','2026-02-24 07:06:21',NULL),(4,'Distribuidora Don Pancho','Luis Hernández','444-222-7788','donpancho@proveedores.mx','2026-02-24 07:06:21','2026-02-24 07:06:21',NULL),(5,'Comercializadora El Sol','Carmen Ruiz','818-444-1122','elsol@comercial.com','2026-02-24 07:06:21','2026-02-24 07:06:21',NULL),(6,'Panificadora Bimbo','Roberto Servitje','555-000-1111','ventas@bimbo.com','2026-03-03 10:09:35','2026-03-03 10:09:35',NULL),(7,'Coca-Cola FEMSA','Arturo Elías','555-222-3333','contacto@coca-cola.mx','2026-03-03 10:09:35','2026-03-03 10:09:35',NULL),(8,'Sigma Alimentos','Patricia Ruiz','818-111-2222','servicio@sigma.com','2026-03-03 10:09:35','2026-03-03 10:09:35',NULL),(9,'P&G México','John Smith','555-999-8888','support@pg.com','2026-03-03 10:09:35','2026-03-03 10:09:35',NULL),(10,'Nestlé','Diego Alba','555-777-6666','nestle@proyectos.com','2026-03-03 10:09:35','2026-03-03 10:09:35',NULL),(11,'Distribuidora XYZ','Roberto Sánchez','3311112222','contacto@xyz.mx','2026-07-31 22:34:47','2026-07-31 22:34:47',NULL);
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Rosa Melano','rosa.cajera@tienda.com',NULL,'$2y$12$7dlwIvN.BQ4Y4fEViUJJNuN9gFHFOmLbvTxGGbWGTc4SlngrSWsmq',NULL,'2026-03-03 10:09:49','2026-03-03 10:09:49'),(3,'Alberto Macen','alberto.stock@tienda.com',NULL,'$2y$12$7dlwIvN.BQ4Y4fEViUJJNuN9gFHFOmLbvTxGGbWGTc4SlngrSWsmq',NULL,'2026-03-03 10:09:49','2026-03-03 10:09:49'),(4,'Yahir','yahir@gmail.com',NULL,'$2y$12$gSm9CXDJ1vZeNuK2WSQF/uQNfMknJ4FQb1nyjjBsEhE79hzgAik66',NULL,'2026-03-03 10:18:55','2026-03-03 10:18:55'),(5,'guillermo esparza','guillermo@gmail.com',NULL,'$2y$12$AILbZ/hUwvLxwahGuBaPCuxLLHVxW3Sjm2HIK3Ixfk5b/FpNLkgXy',NULL,'2026-03-05 05:52:40','2026-03-05 05:52:40'),(6,'Yahir García','yahir.garcia@example.com',NULL,'$2y$12$HW2iBn46fxPppS9Y04LVluVReIqVPJsHH87Hl99gAEr8GjP2bPFMK',NULL,'2026-06-21 00:08:07','2026-06-21 00:08:07'),(7,'Ana Maria gutierres','ana.lopez@tienda.com',NULL,'$2y$12$taLS8/0yrD6hQw5EIeOHmOLYuLdUvKSJwl62CORd/dhH8sFfd8cp.',NULL,'2026-07-31 22:12:59','2026-07-31 22:17:05'),(8,'Anónima López','Anónima.lopez12@tienda.com',NULL,'$2y$12$ryQqr5zijIxU.TIUIzQY5.erB08fUVj3ktCrlHIucyBTelL4qQSRO',NULL,'2026-07-31 23:49:04','2026-07-31 23:49:04'),(9,'Anónima López','Anóniggma.lopez12@tienda.com',NULL,'$2y$12$pW0H1x/rLU7cYZ0f2l7aXOTp.GzLYPPmuxf.ip58OB71hrxf.CaHu',NULL,'2026-08-02 01:21:29','2026-08-02 01:21:29');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-02 22:15:00
