/*
  Warnings:

  - You are about to drop the column `email` on the `Token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,token]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Token_email_token_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "email",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_token_key" ON "Token"("userId", "token");
