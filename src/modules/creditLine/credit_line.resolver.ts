import { validateString } from "../../utils/string_operations";
import { createCreditLineService, getCreditLinesService } from "./credit_line.service";

export const creditLineResolver = {
    Query: {
        getCreditLines: async (_: any, __: any, ctx: any) => {
            if (!ctx.userId) throw new Error("Unauthorized");
            return getCreditLinesService(ctx.userId);
        },
    },

    Mutation: {
        createCreditLine: async (_: any, args: any, ctx: any) => {
            if (!ctx.userId) throw new Error("Unauthorized");

            const name = validateString(args.name);

            if (args.totalLimit <= 0) throw new Error("Invalid limit");

            return createCreditLineService(ctx.userId, name, args.totalLimit);
        },
    },
};