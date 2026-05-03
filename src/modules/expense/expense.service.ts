import { prisma } from "../../lib/prisma";

export const createExpenseService = async ({ userId, input }: {
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
}) => {
    const { title, amount, categoryId, paymentMethodId, creditCardId, date, notes } = input;
    if (amount <= 0) throw new Error("Amount must be greater than 0");

    const category = await prisma.category.findFirst({
        where: { id: categoryId },
    });
    if (!category) throw new Error("Invalid category");

    const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
            id: paymentMethodId,
            OR: [{ userId }, { userId: null }],
        },
    });
    if (!paymentMethod) throw new Error("Invalid payment method");

    return prisma.$transaction(async (tx) => {
        let card = null;

        if (creditCardId) {
            card = await tx.creditCard.findFirst({
                where: { id: creditCardId, userId },
            });
            if (!card) throw new Error("Invalid credit card");
        }

        const expense = await tx.expense.create({
            data: { userId, title, amount, categoryId, paymentMethodId, creditCardId, date, notes },
        });

        if (card) {
            await tx.creditCard.update({
                where: { id: card.id },
                data: {
                    currentUsage: { increment: amount },
                },
            });

            if (card.creditLineId) {
                await tx.creditLine.update({
                    where: { id: card.creditLineId },
                    data: {
                        currentUsage: { increment: amount },
                    },
                });
            }
        }

        return expense;
    });
};

export const getExpensesService = async (userId: string, filter: any) => {
    const where: any = {
        userId,
        deletedAt: null,
    };

    if (filter?.startDate || filter?.endDate) {
        where.date = {};
        if (filter.startDate) where.date.gte = new Date(filter.startDate);
        if (filter.endDate) where.date.lte = new Date(filter.endDate);
    }

    if (filter?.categoryIds?.length) {
        where.categoryId = {
            in: filter.categoryIds,
        };
    }

    if (filter?.paymentMethodIds?.length) {
        where.paymentMethodId = {
            in: filter.paymentMethodIds,
        };
    }

    return prisma.expense.findMany({
        where,
        orderBy: {
            date: "desc",
        },
    });
};
// TODO: We need to restrict user from passing a large time span to fetch. We can either go for pagination as well

export const getMonthlySummaryService = async (userId: string, month: number, year: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const totalAgg = await prisma.expense.aggregate({
        where: {
            userId,
            deletedAt: null,
            date: { gte: startDate, lt: endDate },
        },
        _sum: { amount: true },
    });

    const totalSpent = totalAgg._sum.amount || 0;

    if (totalSpent === 0) {
        return {
            totalSpent: 0,
            categoryBreakdown: [],
            paymentMethodBreakdown: []
        };
    }

    const categoryData = await prisma.expense.groupBy({
        by: ["categoryId"],
        where: {
            userId,
            deletedAt: null,
            date: { gte: startDate, lt: endDate }
        },
        _sum: { amount: true },
    });

    const categoryBreakdown = categoryData.map((c) => ({
        categoryId: c.categoryId,
        total: c._sum.amount || 0,
        percentage: ((c._sum.amount || 0) / totalSpent) * 100,
    }));

    const paymentData = await prisma.expense.groupBy({
        by: ["paymentMethodId"],
        where: {
            userId,
            deletedAt: null,
            date: { gte: startDate, lt: endDate }
        },
        _sum: { amount: true },
    });

    const paymentMethodBreakdown = paymentData.map((p) => ({
        paymentMethodId: p.paymentMethodId,
        total: p._sum.amount || 0,
        percentage: ((p._sum.amount || 0) / totalSpent) * 100,
    }));

    return {
        totalSpent,
        categoryBreakdown,
        paymentMethodBreakdown,
    };
};

// TODO: momthly summary gives payment and categories id, fix that, also what about yearly summary?