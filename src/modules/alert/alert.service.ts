import { prisma } from "../../lib/prisma";

export const getAlertsService = async (userId: string) => {
    return prisma.alert.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const markAlertReadService = async (userId: string, alertId: string) => {
    const alert = await prisma.alert.findFirst({
        where: {
            id: alertId,
            userId,
        },
    });

    if (!alert) throw new Error("Alert not found");

    await prisma.alert.update({
        where: { id: alertId },
        data: { read: true },
    });

    return true;
};