export const incomeTypeDefs = /* GraphQL */ `
    type Income {
        id: ID!
        amount: Float!
        source: String!
        date: String!
        createdAt: String!
    }

    input CreateIncomeInput {
        amount: Float!
        source: String!
        date: String!
    }

    extend type Query {
        getIncomes: [Income!]!
    }

    extend type Mutation {
        createIncome(input: CreateIncomeInput!): Income!
    }
`;