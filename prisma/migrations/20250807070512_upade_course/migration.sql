/*
  Warnings:

  - You are about to drop the column `videoPreview` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Course" DROP COLUMN "videoPreview",
ADD COLUMN     "thumbnail" TEXT;
