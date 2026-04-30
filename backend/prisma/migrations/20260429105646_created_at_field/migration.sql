/*
  Warnings:

  - Added the required column `createdAt` to the `Sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Sessions` ADD COLUMN `createdAt` INTEGER NOT NULL;
