export const creditCardTypeDefs = /* GraphQL */ `
    type CreditCard {
        id: ID!
        name: String!
        billCycleDay: Int!
        limit: Float
        currentUsage: Float!
        creditLineId: ID
    }

    extend type Query {
        getCreditCards: [CreditCard!]!
    }

    extend type Mutation {
        createCreditCard(
            name: String!
            billCycleDay: Int!
            limit: Float
            creditLineId: ID
        ): CreditCard!

        payCreditCard(
            creditCardId: ID!
            amount: Float!
            date: String!
        ): Boolean!
    }
`;