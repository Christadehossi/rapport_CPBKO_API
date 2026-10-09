/*
  Warnings:

  - Changed the type of `deblockAt` on the `Blocked` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `expireAt` on the `token` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Blocked" DROP COLUMN "deblockAt",
ADD COLUMN     "deblockAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "token" DROP COLUMN "expireAt",
ADD COLUMN     "expireAt" TIMESTAMP(3) NOT NULL;
