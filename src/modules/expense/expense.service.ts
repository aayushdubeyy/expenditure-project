import { prisma } from "../../lib/prisma";

export const createExpenseService = async ({ userId, input }: { userId: string; input: {
    title: string;
    amount: number;
    categoryId: string;
    paymentMethodId: number;
    creditCardId?: string;
    date: Date;
    notes?: string;
  }; }) => {
    const { title, amount, categoryId, paymentMethodId, creditCardId, date, notes } = input;

    if (amount <= 0) throw new Error("Amount must be greater than 0");

    const category = await prisma.category.findFirst({ where: { id: categoryId } });

    if (!category) throw new Error("Invalid category");

    const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
            id: paymentMethodId,
            OR: [
                { userId: userId },
                { userId: null },
            ],
        },
    });

    if (!paymentMethod) throw new Error("Invalid payment method");

    if (creditCardId) {
        const card = await prisma.creditCard.findFirst({ where: { id: creditCardId, userId } });
        if (!card) throw new Error("Invalid credit card");
    }

    const expense = await prisma.expense.create({
        data: { userId, title, amount, categoryId, paymentMethodId, creditCardId, date, notes },
    });

    return expense;
};