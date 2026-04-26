import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export const createCreditCardService = async (userId: string, data: any) => {
    const { name, billCycleDay, limit, creditLineId } = data;

    if (creditLineId) {
        const line = await prisma.creditLine.findFirst({
            where: { id: creditLineId, userId },
        });

        if (!line) throw new Error("Invalid credit line");
    }

    return prisma.creditCard.create({
        data: { userId, name, billCycleDay, limit, creditLineId },
    });
};

export const getCreditCardsService = async (userId: string) => {
    return prisma.creditCard.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
};

export const payCreditCardService = async (userId: string, creditCardId: string, amount: number, date: Date) => {
    if (amount <= 0) throw new Error("Invalid amount");

    return prisma.$transaction(async (tx : Prisma.TransactionClient) => {
        const card = await tx.creditCard.findFirst({
            where: { id: creditCardId, userId },
        });

        if (!card) throw new Error("Credit card not found");

        await tx.creditCardPayment.create({
            data: { userId, creditCardId, amount, date },
        });

        await tx.creditCard.update({
            where: { id: creditCardId },
            data: { currentUsage: { decrement: amount } },
        });

        if (card.creditLineId) {
            await tx.creditLine.update({
                where: { id: card.creditLineId },
                data: { currentUsage: { decrement: amount } },
            });
        }

        return true;
    });
};