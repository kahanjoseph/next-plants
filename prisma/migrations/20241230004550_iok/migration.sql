/*
  Warnings:

  - You are about to drop the `_PlantCultivers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlantCultivers" DROP CONSTRAINT "_PlantCultivers_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlantCultivers" DROP CONSTRAINT "_PlantCultivers_B_fkey";

-- DropTable
DROP TABLE "_PlantCultivers";

-- CreateTable
CREATE TABLE "_PlantCultivars" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlantCultivars_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlantCultivars_B_index" ON "_PlantCultivars"("B");

-- AddForeignKey
ALTER TABLE "_PlantCultivars" ADD CONSTRAINT "_PlantCultivars_A_fkey" FOREIGN KEY ("A") REFERENCES "Cultivar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlantCultivars" ADD CONSTRAINT "_PlantCultivars_B_fkey" FOREIGN KEY ("B") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
