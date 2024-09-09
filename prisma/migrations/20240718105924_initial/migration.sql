/*
  Warnings:

  - You are about to drop the `table1` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "table1";

-- CreateTable
CREATE TABLE "Data" (
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("name")
);
