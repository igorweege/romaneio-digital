/*
  Warnings:

  - You are about to drop the column `fileName` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `isSigned` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `signatureToken` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `signedAt` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `signedUrl` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `signerIp` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `signerName` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `storageUrl` on the `Romaneio` table. All the data in the column will be lost.
  - Added the required column `nomeCompleto` to the `Romaneio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Romaneio` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Romaneio_signatureToken_key";

-- AlterTable
ALTER TABLE "Romaneio" DROP COLUMN "fileName",
DROP COLUMN "isSigned",
DROP COLUMN "signatureToken",
DROP COLUMN "signedAt",
DROP COLUMN "signedUrl",
DROP COLUMN "signerIp",
DROP COLUMN "signerName",
DROP COLUMN "storageUrl",
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "emailSolicitante" TEXT,
ADD COLUMN     "nomeCompleto" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
