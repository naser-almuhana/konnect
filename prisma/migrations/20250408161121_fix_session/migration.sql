/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'MENTION';

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");
