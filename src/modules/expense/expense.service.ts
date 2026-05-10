import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { getMonthRange, getTotalExpense, getYearRange } from "../common";

interface createExpenseServ {
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
}

export const createExpenseService = async ({ userId, input }: createExpenseServ) => {
    const validated = await validateExpenseInput(userId, input);

    return prisma.$transaction(async (tx) => {
        const card = await getCreditCardIfNeeded(tx, userId, validated.creditCardId);
        const expense = await createExpense(tx, userId, validated);
        if (card) await updateCreditUsage(tx, userId, card, validated.amount);

        return expense;
    });
};

const validateExpenseInput = async (userId: string, input: any) => {
    const { amount, categoryId, paymentMethodId } = input;

    if (amount <= 0) throw new Error("Amount must be greater than 0");
    const [category, paymentMethod] = await Promise.all([
        prisma.category.findFirst({ where: { id: categoryId } }),
        prisma.paymentMethod.findFirst({
            where: {
                id: paymentMethodId,
                OR: [{ userId }, { userId: null }],
            },
        }),
    ]);
    if (!category) throw new Error("Invalid category");
    if (!paymentMethod) throw new Error("Invalid payment method");

    return input;
};

const createExpense = async (tx: Prisma.TransactionClient, userId: string, input: any) => {
    return tx.expense.create({
        data: { userId, ...input },
    });
};

const updateCreditUsage = async (tx: Prisma.TransactionClient, userId: string, card: any, amount: number) => {
    await incrementCardUsage(tx, card.id, amount);

    if (!card.creditLineId) return;

    const updatedLine = await incrementCreditLineUsage(tx, card.creditLineId, amount);
    await handleCreditUtilizationAlert(tx, userId, updatedLine);
};

const incrementCardUsage = async (tx: Prisma.TransactionClient, cardId: string, amount: number) => {
    return tx.creditCard.update({
        where: { id: cardId },
        data: {
            currentUsage: { increment: amount },
        },
    });
};

const incrementCreditLineUsage = async (tx: Prisma.TransactionClient, creditLineId: string, amount: number) => {
    return tx.creditLine.update({
        where: { id: creditLineId },
        data: {
            currentUsage: { increment: amount },
        },
    });
};

const handleCreditUtilizationAlert = async (tx: Prisma.TransactionClient, userId: string, creditLine: any) => {
    const utilization = calculateUtilizationPercentage(creditLine.currentUsage, creditLine.totalLimit);
    if (utilization <= 30) return;

    const hasUnreadAlert = await hasUnreadUtilizationAlert(tx, userId);
    if (hasUnreadAlert) return;

    await createUtilizationAlert(tx, userId, utilization);
};

const calculateUtilizationPercentage = (currentUsage: number, totalLimit: number) => {
    if (totalLimit === 0) return 0;
    return (currentUsage / totalLimit) * 100;
};

const hasUnreadUtilizationAlert = async (tx: Prisma.TransactionClient, userId: string) => {
    const alert = await tx.alert.findFirst({
        where: {
            userId,
            type: "CREDIT_UTILIZATION",
            read: false,
        },
    });

    return !!alert;
};

const createUtilizationAlert = async (tx: Prisma.TransactionClient, userId: string, utilization: number) => {
    return tx.alert.create({
        data: {
            userId,
            type: "CREDIT_UTILIZATION",
            title: "High Credit Utilization",
            message:
                `Your credit utilization exceeded 30%. ` +
                `Current utilization: ${utilization.toFixed(2)}%`,
        },
    });
};

const getCreditCardIfNeeded = async (tx: Prisma.TransactionClient, userId: string, creditCardId?: string) => {
    if (!creditCardId) return null;

    const card = await tx.creditCard.findFirst({
        where: { id: creditCardId, userId },
    });
    if (!card) throw new Error("Invalid credit card");

    return card;
};

export const getExpensesService = async (userId: string, filter: any) => {
    const where = buildExpenseFilter(userId, filter);

    return prisma.expense.findMany({
        where,
        orderBy: { date: "desc" },
    });
};

const buildExpenseFilter = (userId: string, filter: any) => {
    const where: any = { userId, deletedAt: null };

    if (filter?.startDate || filter?.endDate) {
        where.date = {};
        if (filter.startDate) where.date.gte = new Date(filter.startDate);
        if (filter.endDate) where.date.lte = new Date(filter.endDate);
    }
    if (filter?.categoryIds?.length) where.categoryId = { in: filter.categoryIds };
    if (filter?.paymentMethodIds?.length) where.paymentMethodId = { in: filter.paymentMethodIds };

    return where;
};
// TODO: We need to restrict user from passing a large time span to fetch. We can either go for pagination as well

export const getMonthlySummaryService = async (userId: string, month: number, year: number) => {
    const { startDate, endDate } = getMonthRange(month, year);

    const totalSpent = await getTotalExpense(userId, startDate, endDate);

    if (totalSpent === 0) {
        return { totalSpent: 0, categoryBreakdown: [], paymentMethodBreakdown: [] };
    }

    const [categoryBreakdown, paymentMethodBreakdown] = await Promise.all([
        getCategoryBreakdown(userId, startDate, endDate, totalSpent),
        getPaymentMethodBreakdown(userId, startDate, endDate, totalSpent),
    ]);

    return { totalSpent, categoryBreakdown, paymentMethodBreakdown };
};

export const getYearlySummaryService = async (userId: string, year: number) => {
    const { startDate, endDate } = getYearRange(year);

    const totalSpent = await getTotalExpense(userId, startDate, endDate);
    if (totalSpent === 0) return { totalSpent: 0, categoryBreakdown: [], paymentMethodBreakdown: [] };

    const [categoryBreakdown, paymentMethodBreakdown] =
        await Promise.all([
            getCategoryBreakdown(userId, startDate, endDate, totalSpent),
            getPaymentMethodBreakdown(userId, startDate, endDate, totalSpent),
        ]);

    return { totalSpent, categoryBreakdown, paymentMethodBreakdown };
};

const getCategoryBreakdown = async (userId: string, startDate: Date, endDate: Date, total: number) => {
    const data = await prisma.expense.groupBy({
        by: ["categoryId"],
        where: {
            userId,
            deletedAt: null,
            date: { gte: startDate, lt: endDate },
        },
        _sum: { amount: true },
    });

    const ids = data.map((d) => d.categoryId);
    const categories = await prisma.category.findMany({
        where: { id: { in: ids } },
    });
    const map = new Map(categories.map((c) => [c.id, c.name]));

    return buildBreakdown(data, map, total, "categoryId", "categoryName");
};

const buildBreakdown = (data: any[], map: Map<any, string>, total: number, key: string, nameKey: string) => {
    return data.map((item) => {
        const value = item._sum.amount || 0;

        return {
            [key]: item[key],
            [nameKey]: map.get(item[key]) || "Unknown",
            total: value,
            percentage: (value / total) * 100,
        };
    });
};

const getPaymentMethodBreakdown = async (userId: string, startDate: Date, endDate: Date, total: number) => {
    const data = await prisma.expense.groupBy({
        by: ["paymentMethodId"],
        where: {
            userId,
            deletedAt: null,
            date: { gte: startDate, lt: endDate },
        },
        _sum: { amount: true },
    });

    const ids = data.map((d) => d.paymentMethodId);
    const methods = await prisma.paymentMethod.findMany({
        where: { id: { in: ids } },
    });
    const map = new Map(methods.map((m) => [m.id, m.name]));

    return buildBreakdown(data, map, total, "paymentMethodId", "paymentMethodName");
};