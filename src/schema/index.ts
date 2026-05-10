import { createSchema } from "graphql-yoga";

import { authTypeDefs } from "../modules/auth/auth.types";
import { authResolver } from "../modules/auth/auth.resolver";
import { expenseTypeDefs } from "../modules/expense/expense.types";
import { expenseResolver } from "../modules/expense/expense.resolver";
import { categoryTypeDefs } from "../modules/category/category.types";
import { categoryResolver } from "../modules/category/category.resolver";
import { creditCardTypeDefs } from "../modules/creditCard/credit_card.types";
import { creditLineTypeDefs } from "../modules/creditCard/credit_line.types";
import { creditCardResolver } from "../modules/creditCard/credit_card.resolver";
import { creditLineResolver } from "../modules/creditCard/credit_line.resolver";
import { incomeTypeDefs } from "../modules/income/income.types";
import { incomeResolver } from "../modules/income/income.resolver";
import { dashboardTypeDefs } from "../modules/dashboard/dashboard.types";
import { dashboardResolver } from "../modules/dashboard/dashboard.resolver";
import { alertTypeDefs } from "../modules/alert/alert.types";
import { alertResolver } from "../modules/alert/alert.resolver";

export const schema = createSchema({
    typeDefs: [authTypeDefs, expenseTypeDefs, categoryTypeDefs, creditCardTypeDefs, creditLineTypeDefs, incomeTypeDefs, dashboardTypeDefs, alertTypeDefs],
    resolvers: [authResolver, expenseResolver, categoryResolver, creditCardResolver, creditLineResolver, incomeResolver, dashboardResolver, alertResolver],
});