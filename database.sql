-- ============================================
-- CvSU Campus Event Management System
-- MySQL Database Setup Script
-- ============================================
-- Run this script in your MySQL client:
--   mysql -u root -p < database.sql
--
-- Or login to MySQL first:
--   mysql -u root -p
--   source database.sql;
-- ============================================

-- Create the database
CREATE DATABASE IF NOT EXISTS cvsu_events
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Use the database
USE cvsu_events;

-- Grant privileges (change 'root' to your MySQL user if needed)
-- GRANT ALL PRIVILEGES ON cvsu_events.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================
-- NOTE: Tables are created automatically by
-- Prisma when you run: npx prisma db push
-- You only need this database.sql to create
-- the database itself.
-- ============================================

SELECT 'Database "cvsu_events" created successfully!' AS Status;
SELECT 'Now run: npx prisma db push' AS Next_Step;
