/*
  Warnings:

  - Added the required column `userRoleId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "userRoleId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "userRoles" (
    "id" SERIAL NOT NULL,
    "userRole" TEXT NOT NULL,

    CONSTRAINT "userRoles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_userRoleId_fkey" FOREIGN KEY ("userRoleId") REFERENCES "userRoles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
