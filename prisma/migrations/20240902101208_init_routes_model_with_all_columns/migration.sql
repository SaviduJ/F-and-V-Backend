-- DropForeignKey
ALTER TABLE "Routes" DROP CONSTRAINT "Routes_collectingPersonId_fkey";

-- DropForeignKey
ALTER TABLE "Routes" DROP CONSTRAINT "Routes_factoryManagerId_fkey";

-- DropForeignKey
ALTER TABLE "Routes" DROP CONSTRAINT "Routes_fieldOfficerId_fkey";

-- AlterTable
ALTER TABLE "Routes" ALTER COLUMN "fieldOfficerId" DROP NOT NULL,
ALTER COLUMN "collectingPersonId" DROP NOT NULL,
ALTER COLUMN "factoryManagerId" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Routes" ADD CONSTRAINT "Routes_fieldOfficerId_fkey" FOREIGN KEY ("fieldOfficerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routes" ADD CONSTRAINT "Routes_collectingPersonId_fkey" FOREIGN KEY ("collectingPersonId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routes" ADD CONSTRAINT "Routes_factoryManagerId_fkey" FOREIGN KEY ("factoryManagerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
