-- CreateTable
CREATE TABLE "savedTexts" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "savedText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "savedTexts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "savedTexts" ADD CONSTRAINT "savedTexts_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locationDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savedTexts" ADD CONSTRAINT "savedTexts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
