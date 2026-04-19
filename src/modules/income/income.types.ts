export const incomeTypeDefs = /* GraphQL */ `
    type Income {
        id: ID!
        amount: Float!
        source: String!
        date: String!
        createdAt: String!
    }

    extend type Query {
        getIncomes: [Income!]!
    }

    extend type Mutation {
        createIncome(
            amount: Float!
            source: String!
            date: String!
        ): Income!
    }
`;