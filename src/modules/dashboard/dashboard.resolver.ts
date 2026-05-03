import {
  getFinancialDashboardService,
  getCreditInsightsService,
} from "./dashboard.service";

export const dashboardResolver = {
  Query: {
    getFinancialDashboard: async (_: any, args: any, ctx: any) => {
      if (!ctx.userId) throw new Error("Unauthorized");

      const { month, year } = args;

      return getFinancialDashboardService(ctx.userId, month, year);
    },

    getCreditInsights: async (_: any, __: any, ctx: any) => {
      if (!ctx.userId) throw new Error("Unauthorized");

      return getCreditInsightsService(ctx.userId);
    },
  },
};