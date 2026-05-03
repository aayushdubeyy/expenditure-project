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
        const card = await getCreditCard(tx, userId, creditCardId);

        await createPayment(tx, userId, creditCardId, amount, date);
        await updateCardUsage(tx, creditCardId, amount);

        if (card.creditLineId) {
            await updateCreditLineUsage(tx, card.creditLineId, amount);
        }
        return true;
    });
};

const getCreditCard = async (tx: Prisma.TransactionClient, userId: string, creditCardId: string) => {
    const card = await tx.creditCard.findFirst({
        where: { id: creditCardId, userId },
    });
    if (!card) throw new Error("Credit card not found");
    return card;
};

const createPayment = async (tx: Prisma.TransactionClient, userId: string, creditCardId: string, amount: number, date: Date) => {
    return tx.creditCardPayment.create({
        data: { userId, creditCardId, amount, date },
    });
};

const updateCardUsage = async (tx: Prisma.TransactionClient, creditCardId: string, amount: number) => {
    return tx.creditCard.update({
        where: { id: creditCardId },
        data: { currentUsage: { decrement: amount } },
    });
};

const updateCreditLineUsage = async (tx: Prisma.TransactionClient, creditLineId: string, amount: number) => {
    return tx.creditLine.update({
        where: { id: creditLineId },
        data: { currentUsage: { decrement: amount } },
    });
};