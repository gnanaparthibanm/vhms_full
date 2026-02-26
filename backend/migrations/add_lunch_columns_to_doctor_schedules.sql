-- Add lunch break columns to doctor_schedules table
-- Run this SQL script in your MySQL database

ALTER TABLE `doctor_schedules` 
ADD COLUMN `lunch_start_time` TIME NULL AFTER `end_time`,
ADD COLUMN `lunch_end_time` TIME NULL AFTER `lunch_start_time`;

-- Verify the columns were added
DESCRIBE `doctor_schedules`;
