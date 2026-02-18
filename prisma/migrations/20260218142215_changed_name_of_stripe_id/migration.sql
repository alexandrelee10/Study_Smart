/*
  Warnings:

  - You are about to drop the column `stripCustomerId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripCustomerId",
ADD COLUMN     "stripeCustomerId" TEXT;
