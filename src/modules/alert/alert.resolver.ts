import {
    getAlertsService,
    markAlertReadService,
} from "./alert.service";

export const alertResolver = {
    Query: {
        getAlerts: async (
            _: any,
            __: any,
            ctx: any
        ) => {
            if (!ctx.userId) {
                throw new Error("Unauthorized");
            }

            return getAlertsService(ctx.userId);
        },
    },

    Mutation: {
        markAlertRead: async (
            _: any,
            args: any,
            ctx: any
        ) => {
            if (!ctx.userId) {
                throw new Error("Unauthorized");
            }

            return markAlertReadService(
                ctx.userId,
                args.alertId
            );
        },
    },
};