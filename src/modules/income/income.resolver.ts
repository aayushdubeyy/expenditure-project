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

            const input = args.input;
            if (input.amount <= 0) throw new Error("Amount must be greater than 0");
            const source = validateString(input.source);
            const date = new Date(input.date);
            if (isNaN(date.getTime())) throw new Error("Invalid date");

            return createIncomeService({
                userId: ctx.userId,
                input: {
                    amount: input.amount,
                    source,
                    date,
                },
            });
        },
    },
};