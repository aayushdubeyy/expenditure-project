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

    extend type Mutation {
        createExpense(input: CreateExpenseInput!): Expense!
    }
`;