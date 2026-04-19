import { validateString } from "../../utils/string_operations";
import { createIncomeService, getIncomesService } from "./income.service";

export const incomeResolver = {
    Query: {
        getIncomes: async (_: any, __: any, ctx: any) => {
            if (!ctx.userId) throw new Error("Unauthorized");
            return getIncomesService(ctx.userId);
        },
    },

    Mutation: {
        createIncome: async (_: any, args: any, ctx: any) => {
            if (!ctx.userId) throw new Error("Unauthorized");

            if (args.amount <= 0) throw new Error("Invalid amount");

            const source = validateString(args.source);
            const date = new Date(args.date);

            return createIncomeService(ctx.userId, { amount: args.amount, source, date });
        },
    },
};