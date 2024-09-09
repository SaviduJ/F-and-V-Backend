/*
  Warnings:

  - Added the required column `collectingPersonId` to the `Routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `factoryManagerId` to the `Routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Routes" ADD COLUMN     "Good" TEXT,
ADD COLUMN     "Rejected" TEXT,
ADD COLUMN     "collectingPersonId" INTEGER NOT NULL,
ADD COLUMN     "factoryManagerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Routes" ADD CONSTRAINT "Routes_collectingPersonId_fkey" FOREIGN KEY ("collectingPersonId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routes" ADD CONSTRAINT "Routes_factoryManagerId_fkey" FOREIGN KEY ("factoryManagerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
