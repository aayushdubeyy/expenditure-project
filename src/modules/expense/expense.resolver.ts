import { validateString } from "../../utils/string_operations";
import { createExpenseService, getExpensesService, getMonthlySummaryService } from "./expense.service";

export const expenseResolver = {
    Mutation: {
        createExpense: async (_: any, args: any, context: any) => {
            if (!context.userId) throw new Error("Unauthorized");

            const input = args.input;

            const title = validateString(input.title);

            if (input.amount <= 0) throw new Error("Amount must be greater than 0");

            const categoryId = validateString(input.categoryId);

            const paymentMethodId = input.paymentMethodId;
            if (!paymentMethodId) throw new Error("Invalid payment method");

            const creditCardId = input.creditCardId ? validateString(input.creditCardId) : undefined;

            const date = new Date(input.date);
            if (isNaN(date.getTime())) throw new Error("Invalid date");

            const notes = input.notes ? validateString(input.notes) : undefined;

            return createExpenseService({
                userId: context.userId,
                input: {
                    title, amount: input.amount, categoryId, paymentMethodId, creditCardId, date, notes,
                },
            });
        },
    },
    Query: {
        getExpenses: async (_: any, args: any, ctx: any) => {
            if (!ctx.userId) throw new Error("Unauthorized");
            return getExpensesService(ctx.userId, args.filter);
        },
        monthlySummary: async (_: any, args: any, ctx: any) => {
            if (!ctx.userId) throw new Error("Unauthorized");
            const { month, year } = args;

            if (month < 1 || month > 12) throw new Error("Invalid month");
            if (year < 2000 || year > 2100) throw new Error("Invalid year");

            return getMonthlySummaryService(ctx.userId, month, year);
        }
    },
};