/*
  Warnings:

  - Made the column `facebookUrl` on table `LandingPageSettings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `twitterUrl` on table `LandingPageSettings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `linkedinUrl` on table `LandingPageSettings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `instagramUrl` on table `LandingPageSettings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."LandingPageSettings" ALTER COLUMN "facebookUrl" SET NOT NULL,
ALTER COLUMN "facebookUrl" SET DEFAULT 'https://www.facebook.com/robotedge.um',
ALTER COLUMN "twitterUrl" SET NOT NULL,
ALTER COLUMN "twitterUrl" SET DEFAULT 'https://twitter.com/robotedge_um',
ALTER COLUMN "linkedinUrl" SET NOT NULL,
ALTER COLUMN "linkedinUrl" SET DEFAULT 'https://www.linkedin.com/company/robotedge',
ALTER COLUMN "instagramUrl" SET NOT NULL,
ALTER COLUMN "instagramUrl" SET DEFAULT 'https://www.instagram.com/robotedge.um';
