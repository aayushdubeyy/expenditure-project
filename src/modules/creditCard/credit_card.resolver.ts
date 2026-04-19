import { validateString } from "../../utils/string_operations";
import { createCreditCardService, getCreditCardsService } from "./credit_card.service";

export const creditCardResolver = {
    Query: {
        getCreditCards: async (_: any, __: any, ctx: any) => {
            if (!ctx.userId) throw new Error("Unauthorized");
            return getCreditCardsService(ctx.userId);
        },
    },

    Mutation: {
        createCreditCard: async (_: any, args: any, ctx: any) => {
            if (!ctx.userId) throw new Error("Unauthorized");

            const name = validateString(args.name);

            if (args.billCycleDay < 1 || args.billCycleDay > 31) throw new Error("Invalid billing day");

            return createCreditCardService(ctx.userId, { ...args, name });
        },
    },
};