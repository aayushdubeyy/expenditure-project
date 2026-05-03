export const dashboardTypeDefs = /* GraphQL */ `
  type TopCategory {
    categoryId: ID!
    categoryName: String!
    total: Float!
    percentage: Float!
  }

  type CreditUtilization {
    totalLimit: Float!
    totalUsage: Float!
    utilizationPercentage: Float!
    remainingLimit: Float!
  }

  type FinancialDashboard {
    totalIncome: Float!
    totalExpense: Float!
    netSavings: Float!
    topCategories: [TopCategory!]!
    creditUtilization: CreditUtilization!
  }

  type CreditCardUsage {
    cardId: ID!
    name: String!
    usage: Float!
    limit: Float
  }

  type CreditInsights {
    totalDebt: Float!
    totalLimit: Float!
    utilizationPercentage: Float!
    remainingLimit: Float!
    cards: [CreditCardUsage!]!
  }

  extend type Query {
    getFinancialDashboard(month: Int!, year: Int!): FinancialDashboard!
    getCreditInsights: CreditInsights!
  }
`;