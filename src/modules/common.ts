import { prisma } from "../lib/prisma";

export const getTotalExpense = async (userId: string, startDate: Date, endDate: Date) => {
    const result = await prisma.expense.aggregate({
        where: {
            userId,
            deletedAt: null,
            date: { gte: startDate, lt: endDate },
        },
        _sum: { amount: true },
    });

    return result._sum.amount || 0;
};

export const getMonthRange = (month: number, year: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    return { startDate, endDate };
};