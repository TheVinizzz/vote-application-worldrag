/*
  Warnings:

  - You are about to drop the column `validated` on the `User` table. All the data in the column will be lost.
  - Added the required column `validatedBR` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validatedORG` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `validated`,
    ADD COLUMN `validatedBR` BOOLEAN NOT NULL,
    ADD COLUMN `validatedORG` BOOLEAN NOT NULL;
