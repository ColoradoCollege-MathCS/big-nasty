/*
  Warnings:

  - You are about to drop the `County` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proposition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Result` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Year` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_countyId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_propositionId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_yearId_fkey";

-- DropTable
DROP TABLE "County";

-- DropTable
DROP TABLE "Proposition";

-- DropTable
DROP TABLE "Result";

-- DropTable
DROP TABLE "Year";

-- CreateTable
CREATE TABLE "proposition_votes" (
    "proposition_id" SERIAL NOT NULL,
    "proposition_name" VARCHAR(255) NOT NULL,
    "proposition_year" INTEGER NOT NULL,
    "yes_votes_adams" INTEGER,
    "no_votes_adams" INTEGER,
    "yes_votes_alamosa" INTEGER,
    "no_votes_alamosa" INTEGER,
    "yes_votes_arapahoe" INTEGER,
    "no_votes_arapahoe" INTEGER,
    "yes_votes_archuleta" INTEGER,
    "no_votes_archuleta" INTEGER,
    "yes_votes_baca" INTEGER,
    "no_votes_baca" INTEGER,
    "yes_votes_bent" INTEGER,
    "no_votes_bent" INTEGER,
    "yes_votes_boulder" INTEGER,
    "no_votes_boulder" INTEGER,
    "yes_votes_broomfield" INTEGER,
    "no_votes_broomfield" INTEGER,
    "yes_votes_chaffee" INTEGER,
    "no_votes_chaffee" INTEGER,
    "yes_votes_clear_creek" INTEGER,
    "no_votes_clear_creek" INTEGER,
    "yes_votes_douglas" INTEGER,
    "no_votes_douglas" INTEGER,
    "yes_votes_eagle" INTEGER,
    "no_votes_eagle" INTEGER,
    "yes_votes_elpaso" INTEGER,
    "no_votes_elpaso" INTEGER,
    "yes_votes_elbert" INTEGER,
    "no_votes_elbert" INTEGER,
    "yes_votes_fremont" INTEGER,
    "no_votes_fremont" INTEGER,
    "yes_votes_garfield" INTEGER,
    "no_votes_garfield" INTEGER,
    "yes_votes_gilpin" INTEGER,
    "no_votes_gilpin" INTEGER,
    "yes_votes_grand" INTEGER,
    "no_votes_grand" INTEGER,
    "yes_votes_gunnison" INTEGER,
    "no_votes_gunnison" INTEGER,
    "yes_votes_hinsdale" INTEGER,
    "no_votes_hinsdale" INTEGER,
    "yes_votes_huerfano" INTEGER,
    "no_votes_huerfano" INTEGER,
    "yes_votes_jackson" INTEGER,
    "no_votes_jackson" INTEGER,
    "yes_votes_jefferson" INTEGER,
    "no_votes_jefferson" INTEGER,
    "yes_votes_kiowa" INTEGER,
    "no_votes_kiowa" INTEGER,
    "yes_votes_kit_carson" INTEGER,
    "no_votes_kit_carson" INTEGER,
    "yes_votes_la_plata" INTEGER,
    "no_votes_la_plata" INTEGER,
    "yes_votes_lake" INTEGER,
    "no_votes_lake" INTEGER,
    "yes_votes_larimer" INTEGER,
    "no_votes_larimer" INTEGER,
    "yes_votes_las_animas" INTEGER,
    "no_votes_las_animas" INTEGER,
    "yes_votes_lincoln" INTEGER,
    "no_votes_lincoln" INTEGER,
    "yes_votes_logan" INTEGER,
    "no_votes_logan" INTEGER,
    "yes_votes_mesa" INTEGER,
    "no_votes_mesa" INTEGER,
    "yes_votes_mineral" INTEGER,
    "no_votes_mineral" INTEGER,
    "yes_votes_moffat" INTEGER,
    "no_votes_moffat" INTEGER,
    "yes_votes_montezuma" INTEGER,
    "no_votes_montezuma" INTEGER,
    "yes_votes_montrose" INTEGER,
    "no_votes_montrose" INTEGER,
    "yes_votes_morgan" INTEGER,
    "no_votes_morgan" INTEGER,
    "yes_votes_otero" INTEGER,
    "no_votes_otero" INTEGER,
    "yes_votes_ouray" INTEGER,
    "no_votes_ouray" INTEGER,
    "yes_votes_park" INTEGER,
    "no_votes_park" INTEGER,
    "yes_votes_phillips" INTEGER,
    "no_votes_phillips" INTEGER,
    "yes_votes_pitkin" INTEGER,
    "no_votes_pitkin" INTEGER,
    "yes_votes_prowers" INTEGER,
    "no_votes_prowers" INTEGER,
    "yes_votes_pueblo" INTEGER,
    "no_votes_pueblo" INTEGER,
    "yes_votes_rio_blanco" INTEGER,
    "no_votes_rio_blanco" INTEGER,
    "yes_votes_rio_grande" INTEGER,
    "no_votes_rio_grande" INTEGER,
    "yes_votes_routt" INTEGER,
    "no_votes_routt" INTEGER,
    "yes_votes_saguache" INTEGER,
    "no_votes_saguache" INTEGER,
    "yes_votes_san_juan" INTEGER,
    "no_votes_san_juan" INTEGER,
    "yes_votes_san_miguel" INTEGER,
    "no_votes_san_miguel" INTEGER,
    "yes_votes_sedgwick" INTEGER,
    "no_votes_sedgwick" INTEGER,
    "yes_votes_summit" INTEGER,
    "no_votes_summit" INTEGER,
    "yes_votes_teller" INTEGER,
    "no_votes_teller" INTEGER,
    "yes_votes_washington" INTEGER,
    "no_votes_washington" INTEGER,
    "yes_votes_weld" INTEGER,
    "no_votes_weld" INTEGER,
    "yes_votes_yuma" INTEGER,
    "no_votes_yuma" INTEGER,
    "total_yes_votes" INTEGER,
    "total_no_votes" INTEGER,

    CONSTRAINT "proposition_votes_pkey" PRIMARY KEY ("proposition_id")
);

-- CreateTable
CREATE TABLE "propositions" (
    "proposition_id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "propositions_pkey" PRIMARY KEY ("proposition_id")
);

-- CreateTable
CREATE TABLE "years" (
    "year" INTEGER NOT NULL,

    CONSTRAINT "years_pkey" PRIMARY KEY ("year")
);
