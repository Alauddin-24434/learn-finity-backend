/*
  Warnings:

  - You are about to drop the column `publicId` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `thumbnailPublicId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoPublicId` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "thumbnailPublicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Lesson" DROP COLUMN "publicId",
ADD COLUMN     "videoPublicId" TEXT NOT NULL;
