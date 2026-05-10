export const expenseTypeDefs = /* GraphQL */ `
    type Expense {
        id: ID!
        title: String!
        amount: Float!
        date: String!
        notes: String

        categoryId: ID!
        paymentMethodId: Int!
        creditCardId: ID

        createdAt: String!
    }

    input CreateExpenseInput {
        title: String!
        amount: Float!
        categoryId: ID!
        paymentMethodId: Int!
        creditCardId: ID
        date: String!
        notes: String
    }

    input ExpenseFilterInput {
        startDate: String
        endDate: String
        categoryIds: [ID!]
        paymentMethodIds: [Int!]
    }

    type CategoryBreakdown {
        categoryId: ID!
        categoryName: String!
        total: Float!
        percentage: Float!
    }

    type PaymentMethodBreakdown {
        paymentMethodId: Int!
        paymentMethodName: String!
        total: Float!
        percentage: Float!
    }

    type MonthlySummary {
        totalSpent: Float!
        categoryBreakdown: [CategoryBreakdown!]!
        paymentMethodBreakdown: [PaymentMethodBreakdown!]!
    }

    type YearlySummary {
        totalSpent: Float!
        categoryBreakdown: [CategoryBreakdown!]!
        paymentMethodBreakdown: [PaymentMethodBreakdown!]!
    }

    extend type Mutation {
        createExpense(input: CreateExpenseInput!): Expense!
    }
    extend type Query {
        getExpenses(filter: ExpenseFilterInput): [Expense!]!
        monthlySummary(month: Int!, year: Int!): MonthlySummary!
        yearlySummary(year: Int!): YearlySummary!
    }
`;