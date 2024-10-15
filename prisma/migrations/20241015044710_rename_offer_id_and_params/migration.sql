/*
  Warnings:

  - You are about to drop the column `offerId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `params` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,providerOfferId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerOfferDetails` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerOfferId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingProvider" AS ENUM ('DUFFEL');

-- DropIndex
DROP INDEX "Booking_offerId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "offerId",
DROP COLUMN "params",
ADD COLUMN     "provider" "BookingProvider" NOT NULL DEFAULT 'DUFFEL',
ADD COLUMN     "providerOfferDetails" JSONB NOT NULL,
ADD COLUMN     "providerOfferId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_userId_providerOfferId_key" ON "Booking"("userId", "providerOfferId");
