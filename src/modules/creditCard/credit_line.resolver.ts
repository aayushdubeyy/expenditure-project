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

            if (args.totalLimit <= 0) throw new Error("Invalid limit");

            return createCreditLineService(ctx.userId, args.name, args.totalLimit);
        },
    }
};