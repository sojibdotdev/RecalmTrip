/*
  Warnings:

  - The `history` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `params` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "bookingSataus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "params" JSONB NOT NULL,
DROP COLUMN "history",
ADD COLUMN     "history" JSONB[];
