/*
  Warnings:

  - Added the required column `action` to the `LogEntry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('USER_LOGIN', 'USER_CREATED', 'USER_UPDATED', 'USER_ROLE_CHANGED', 'ROMANEIO_CREATED', 'ROMANEIO_SIGNED');

-- AlterTable
ALTER TABLE "LogEntry" ADD COLUMN     "action" "LogAction" NOT NULL;
