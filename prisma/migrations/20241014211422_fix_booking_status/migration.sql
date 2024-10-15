/*
  Warnings:

  - The `bookingSataus` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingSataus",
ADD COLUMN     "bookingSataus" "BookingStatus" NOT NULL DEFAULT 'PENDING';
