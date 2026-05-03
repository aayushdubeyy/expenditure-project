import { prisma } from "../../lib/prisma";
import { getMonthRange, getTotalExpense } from "../common";

export const getFinancialDashboardService = async (userId: string, month: number, year: number, topN = 5) => {
    const { startDate, endDate } = getMonthRange(month, year);

    const totalExpense = await getTotalExpense(userId, startDate, endDate);
    const totalIncome = await getTotalIncome(userId, startDate, endDate);

    const netSavings = totalIncome - totalExpense;

    const topCategories = await getTopCategories(userId, startDate, endDate, totalExpense, topN);

    const creditUtilization = await getCreditUtilization(userId);

    return {
        totalIncome,
        totalExpense,
        netSavings,
        topCategories,
        creditUtilization,
    };
};

const getTotalIncome = async (userId: string, startDate: Date, endDate: Date) => {
    const result = await prisma.income.aggregate({
        where: {
            userId,
            date: { gte: startDate, lt: endDate },
        },
        _sum: { amount: true },
    });

    return result._sum.amount || 0;
};

const getTopCategories = async (userId: string, startDate: Date, endDate: Date, totalExpense: number, topN: number) => {
    const categoryData = await fetchCategoryAggregates(userId, startDate, endDate, topN);

    const categoryMap = await getCategoryMap(categoryData);

    return buildTopCategoryResponse(categoryData, categoryMap, totalExpense);
};

const fetchCategoryAggregates = async (userId: string, startDate: Date, endDate: Date, topN: number) => {
    return prisma.expense.groupBy({
        by: ["categoryId"],
        where: {
            userId,
            deletedAt: null,
            date: { gte: startDate, lt: endDate },
        },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
        take: topN,
    });
};

const getCategoryMap = async (categoryData: any[]) => {
    const categoryIds = categoryData.map((c) => c.categoryId);

    if (categoryIds.length === 0) return new Map();

    const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
    });

    return new Map(categories.map((c) => [c.id, c.name]));
};

const buildTopCategoryResponse = (categoryData: any[], categoryMap: Map<string, string>, totalExpense: number) => {
    return categoryData.map((c) => {
        const total = c._sum.amount || 0;
        return {
            categoryId: c.categoryId,
            categoryName: categoryMap.get(c.categoryId) || "Unknown",
            total,
            percentage: totalExpense > 0 ? (total / totalExpense) * 100 : 0,
        };
    });
};

const getCreditUtilization = async (userId: string) => {
    const creditLines = await prisma.creditLine.findMany({
        where: { userId },
    });

    const totalLimit = creditLines.reduce((sum, l) => sum + l.totalLimit, 0);
    const totalUsage = creditLines.reduce((sum, l) => sum + l.currentUsage, 0);

    return {
        totalLimit,
        totalUsage,
        utilizationPercentage: totalLimit > 0 ? (totalUsage / totalLimit) * 100 : 0,
        remainingLimit: totalLimit - totalUsage,
    };
};

export const getCreditInsightsService = async (userId: string) => {
    const creditUtilization = await getCreditUtilization(userId);
    const cards = await getCreditCards(userId);

    return {
        totalDebt: creditUtilization.totalUsage,
        totalLimit: creditUtilization.totalLimit,
        utilizationPercentage: creditUtilization.utilizationPercentage,
        remainingLimit: creditUtilization.remainingLimit,
        cards,
    };
};

const getCreditCards = async (userId: string) => {
    const creditCards = await prisma.creditCard.findMany({
        where: { userId },
    });

    return creditCards.map((c) => ({
        cardId: c.id,
        name: c.name,
        usage: c.currentUsage,
        limit: c.limit,
    }));
};