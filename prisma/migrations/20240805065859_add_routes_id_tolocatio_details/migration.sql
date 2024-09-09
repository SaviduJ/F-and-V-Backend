/*
  Warnings:

  - Added the required column `routeId` to the `locationDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locationDetails" ADD COLUMN     "routeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "locationDetails" ADD CONSTRAINT "locationDetails_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
