/*
  Warnings:

  - You are about to drop the `Cultiver` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cultiver" DROP CONSTRAINT "Cultiver_speciesId_fkey";

-- DropForeignKey
ALTER TABLE "_PlantCultivers" DROP CONSTRAINT "_PlantCultivers_A_fkey";

-- DropTable
DROP TABLE "Cultiver";

-- CreateTable
CREATE TABLE "Cultivar" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "speciesId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cultivar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cultivar_speciesId_name_key" ON "Cultivar"("speciesId", "name");

-- AddForeignKey
ALTER TABLE "Cultivar" ADD CONSTRAINT "Cultivar_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlantCultivers" ADD CONSTRAINT "_PlantCultivers_A_fkey" FOREIGN KEY ("A") REFERENCES "Cultivar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
