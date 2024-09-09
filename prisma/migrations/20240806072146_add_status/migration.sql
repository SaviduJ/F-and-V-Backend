/*
  Warnings:

  - Added the required column `status` to the `Routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Routes" ADD COLUMN     "status" INTEGER NOT NULL;
