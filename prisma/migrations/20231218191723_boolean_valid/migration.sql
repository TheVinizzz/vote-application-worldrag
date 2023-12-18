/*
  Warnings:

  - You are about to alter the column `validated` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `validated` BOOLEAN NOT NULL;
