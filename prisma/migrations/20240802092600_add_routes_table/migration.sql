-- CreateTable
CREATE TABLE "Routes" (
    "id" SERIAL NOT NULL,
    "routesName" TEXT NOT NULL,
    "fieldOfficerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Routes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Routes" ADD CONSTRAINT "Routes_fieldOfficerId_fkey" FOREIGN KEY ("fieldOfficerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
