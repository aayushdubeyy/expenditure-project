import { prisma } from "../../lib/prisma";

export const createCategoryService = async (userId: string | null, name: string) => {
    return prisma.category.create({
        data: {
            name,
            userId,
        },
    });
};

export const getCategoriesService = async (userId: string) => {
    return prisma.category.findMany({
        where: {
            OR: [
                { userId: null },      // global
                { userId: userId },   // user-specific
            ],
        },
        orderBy: {
            name: "asc",
        },
    });
};