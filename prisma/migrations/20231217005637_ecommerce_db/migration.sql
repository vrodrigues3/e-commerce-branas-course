-- CreateTable
CREATE TABLE "Coupon" (
    "code" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
