import { prisma } from "../../lib/prisma";

export const createIncomeService = async (userId: string, data: any) => {
    return prisma.income.create({
        data: { userId, ...data, },
    });
};

export const getIncomesService = async (userId: string) => {
    return prisma.income.findMany({
        where: { userId },
        orderBy: { date: "desc" },
    });
};