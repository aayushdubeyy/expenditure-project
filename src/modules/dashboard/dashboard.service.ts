import { prisma } from "../../lib/prisma";

export const getFinancialDashboardService = async (
    userId: string,
    month: number,
    year: number
) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const expenseAgg = await prisma.expense.aggregate({
        where: {
            userId,
            deletedAt: null,
            date: { gte: startDate, lt: endDate }
        },
        _sum: { amount: true },
    });

    const totalExpense = expenseAgg._sum.amount || 0;
    const incomeAgg = await prisma.income.aggregate({
        where: {
            userId,
            date: { gte: startDate, lt: endDate }
        },
        _sum: { amount: true },
    });

    const totalIncome = incomeAgg._sum.amount || 0;
    const netSavings = totalIncome - totalExpense;

    const categoryData = await prisma.expense.groupBy({
        by: ["categoryId"],
        where: {
            userId,
            deletedAt: null,
            date: { gte: startDate, lt: endDate }
        },
        _sum: { amount: true },
        orderBy: {
            _sum: { amount: "desc" },
        },
        take: 5,
    });

    const topCategories = categoryData.map((c) => ({
        categoryId: c.categoryId,
        total: c._sum.amount || 0,
    }));

    const creditLines = await prisma.creditLine.findMany({
        where: { userId },
    });

    const totalLimit = creditLines.reduce((sum, l) => sum + l.totalLimit, 0);
    const totalUsage = creditLines.reduce((sum, l) => sum + l.currentUsage, 0);

    const utilizationPercentage = totalLimit > 0 ? (totalUsage / totalLimit) * 100 : 0;
    const remainingLimit = totalLimit - totalUsage;

    return {
        totalIncome,
        totalExpense,
        netSavings,
        topCategories,
        creditUtilization: {
            totalLimit,
            totalUsage,
            utilizationPercentage,
            remainingLimit
        }
    };
};

export const getCreditInsightsService = async (userId: string) => {
    const creditLines = await prisma.creditLine.findMany({
        where: { userId },
    });

    const creditCards = await prisma.creditCard.findMany({
        where: { userId },
    });

    const totalLimit = creditLines.reduce((sum, l) => sum + l.totalLimit, 0);
    const totalDebt = creditLines.reduce((sum, l) => sum + l.currentUsage, 0);

    const utilizationPercentage = totalLimit > 0 ? (totalDebt / totalLimit) * 100 : 0;
    const remainingLimit = totalLimit - totalDebt;

    const cards = creditCards.map((c) => ({
        cardId: c.id,
        name: c.name,
        usage: c.currentUsage,
        limit: c.limit,
    }));

    return {
        totalDebt,
        totalLimit,
        utilizationPercentage,
        remainingLimit,
        cards,
    };
};

// TODO: In top categories it gives ids rather than actual categories, fix that