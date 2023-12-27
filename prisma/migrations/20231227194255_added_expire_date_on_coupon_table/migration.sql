/*
  Warnings:

  - Added the required column `expireDate` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "code" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "expireDate" DATETIME NOT NULL
);
INSERT INTO "new_Coupon" ("code", "percentage") SELECT "code", "percentage" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
