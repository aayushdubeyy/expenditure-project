import { validateString } from "../../utils/string_operations";
import { createExpenseService } from "./expense.service";

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
};