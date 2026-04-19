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