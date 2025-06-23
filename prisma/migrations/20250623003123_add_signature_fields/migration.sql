/*
  Warnings:

  - A unique constraint covering the columns `[signatureToken]` on the table `Romaneio` will be added. If there are existing duplicate values, this will fail.
  - The required column `signatureToken` was added to the `Romaneio` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Romaneio" ADD COLUMN     "isSigned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "signatureToken" TEXT NOT NULL,
ADD COLUMN     "signedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Romaneio_signatureToken_key" ON "Romaneio"("signatureToken");
