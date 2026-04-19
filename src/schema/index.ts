import { createSchema } from "graphql-yoga";

import { authTypeDefs } from "../modules/auth/auth.types";
import { authResolver } from "../modules/auth/auth.resolver";
import { expenseTypeDefs } from "../modules/expense/expense.types";
import { expenseResolver } from "../modules/expense/expense.resolver";
import { categoryTypeDefs } from "../modules/category/category.types";
import { categoryResolver } from "../modules/category/category.resolver";

export const schema = createSchema({
    typeDefs: [authTypeDefs, expenseTypeDefs, categoryTypeDefs],
    resolvers: [authResolver, expenseResolver, categoryResolver],
});