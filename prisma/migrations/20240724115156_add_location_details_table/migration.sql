-- CreateTable
CREATE TABLE "locationDetails" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "locationInput" TEXT NOT NULL,

    CONSTRAINT "locationDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "locationDetails" ADD CONSTRAINT "locationDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
