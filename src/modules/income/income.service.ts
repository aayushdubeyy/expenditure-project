import { prisma } from "../../lib/prisma";

export const createIncomeService = async ({ userId, input }: {
    userId: string;
    input: { amount: number; source: string; date: Date; };
}) => {
    const { amount, source, date } = input;
    if (amount <= 0) throw new Error("Amount must be greater than 0");

    return prisma.income.create({
        data: {userId, amount, source, date },
    });
};

export const getIncomesService = async (userId: string) => {
    return prisma.income.findMany({
        where: { userId },
        orderBy: { date: "desc" },
    });
};

// TODO: Think of recurring dates like monthly salary, currently we have to enter every month with date