import { prisma } from "../../lib/prisma";

export const createExpenseService = async ({ userId, input }: {
  userId: string;
  input: {
    title: string;
    amount: number;
    categoryId: string;
    paymentMethodId: number;
    creditCardId?: string;
    date: Date;
    notes?: string;
  };
}) => {
    const { title, amount, categoryId, paymentMethodId, creditCardId, date, notes } = input;

    if (amount <= 0) throw new Error("Amount must be greater than 0");

    const category = await prisma.category.findFirst({
        where: { id: categoryId },
    });
    if (!category) throw new Error("Invalid category");

    const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
            id: paymentMethodId,
            OR: [{ userId }, { userId: null }],
        },
    });
    if (!paymentMethod) throw new Error("Invalid payment method");

    return prisma.$transaction(async (tx) => {
        let card = null;

        if (creditCardId) {
            card = await tx.creditCard.findFirst({
                where: { id: creditCardId, userId },
            });
            if (!card) throw new Error("Invalid credit card");
        }

        const expense = await tx.expense.create({
            data: { userId, title, amount, categoryId, paymentMethodId, creditCardId, date, notes },
        });

        if (card) {
            await tx.creditCard.update({
                where: { id: card.id },
                data: {
                    currentUsage: { increment: amount },
                },
            });

            if (card.creditLineId) {
                await tx.creditLine.update({
                    where: { id: card.creditLineId },
                    data: {
                        currentUsage: { increment: amount },
                    },
                });
            }
        }

        return expense;
    });
};