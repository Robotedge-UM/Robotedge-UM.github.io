/*
  Warnings:

  - Made the column `contactPhone` on table `LandingPageSettings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."LandingPageSettings" ADD COLUMN     "contactAddress" TEXT NOT NULL DEFAULT 'Faculty of Computer Science and Information Technology, Universiti Malaya, 50603 Kuala Lumpur, Malaysia',
ADD COLUMN     "emailUrl" TEXT NOT NULL DEFAULT 'mailto:umrobotedge@gmail.com',
ADD COLUMN     "mapEmbedUrl" TEXT,
ADD COLUMN     "mapLatitude" DOUBLE PRECISION DEFAULT 3.1319,
ADD COLUMN     "mapLongitude" DOUBLE PRECISION DEFAULT 101.6553,
ALTER COLUMN "contactPhone" SET NOT NULL,
ALTER COLUMN "contactPhone" SET DEFAULT '+60 3-7967 4000';
