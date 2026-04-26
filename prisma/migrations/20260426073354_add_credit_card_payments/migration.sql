-- CreateTable
CREATE TABLE "credit_card_payments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "credit_card_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_card_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "credit_card_payments_user_id_idx" ON "credit_card_payments"("user_id");

-- CreateIndex
CREATE INDEX "credit_card_payments_credit_card_id_idx" ON "credit_card_payments"("credit_card_id");

-- CreateIndex
CREATE INDEX "credit_card_payments_date_idx" ON "credit_card_payments"("date");

-- AddForeignKey
ALTER TABLE "credit_card_payments" ADD CONSTRAINT "credit_card_payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_card_payments" ADD CONSTRAINT "credit_card_payments_credit_card_id_fkey" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
