/*
  Warnings:

  - You are about to drop the column `isFree` on the `Course` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PREMIUM');

-- AlterTable
ALTER TABLE "public"."Course" DROP COLUMN "isFree",
ADD COLUMN     "level" "public"."CourseLevel";
