-- AlterTable
ALTER TABLE "public"."HomeSection" ADD COLUMN     "autoScrollDelay" INTEGER DEFAULT 8000,
ADD COLUMN     "infiniteScroll" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showNavigation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showPagination" BOOLEAN NOT NULL DEFAULT true;
