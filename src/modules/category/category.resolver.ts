import { validateString } from "../../utils/string_operations";
import { createCategoryService, getCategoriesService } from "./category.service";

export const categoryResolver = {
    Query: {
        getCategories: async (_: any, __: any, context: any) => {
            if (!context.userId) throw new Error("Unauthorized");
            return getCategoriesService(context.userId);
        },
    },

    Mutation: {
        createCategory: async (_: any, args: any, context: any) => {
            if (!context.userId) throw new Error("Unauthorized");
            const name = validateString(args.name);
            return createCategoryService(null, name);
        },
    },
};