import { prisma } from "../../lib/prisma";

export const createCreditLineService = async (userId: string, name: string, totalLimit: number) => {
    return prisma.creditLine.create({
      data: { userId, name, totalLimit },
    });
};

export const getCreditLinesService = async (userId: string) => {
    return prisma.creditLine.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
};