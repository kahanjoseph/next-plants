/*
  Warnings:

  - You are about to drop the column `plantId` on the `Cultiver` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[speciesId,name]` on the table `Cultiver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[familyId,name]` on the table `Species` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `speciesId` to the `Cultiver` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cultiver" DROP CONSTRAINT "Cultiver_plantId_fkey";

-- AlterTable
ALTER TABLE "Cultiver" DROP COLUMN "plantId",
ADD COLUMN     "speciesId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Plant" ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_PlantCultivers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlantCultivers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlantCultivers_B_index" ON "_PlantCultivers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Cultiver_speciesId_name_key" ON "Cultiver"("speciesId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Species_familyId_name_key" ON "Species"("familyId", "name");

-- AddForeignKey
ALTER TABLE "Cultiver" ADD CONSTRAINT "Cultiver_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlantCultivers" ADD CONSTRAINT "_PlantCultivers_A_fkey" FOREIGN KEY ("A") REFERENCES "Cultiver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlantCultivers" ADD CONSTRAINT "_PlantCultivers_B_fkey" FOREIGN KEY ("B") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
