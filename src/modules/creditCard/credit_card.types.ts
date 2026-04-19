export const creditCardTypeDefs = /* GraphQL */ `
    type CreditCard {
        id: ID!
        name: String!
        limit: Float
        billCycleDay: Int!
        currentUsage: Float!
        creditLineId: ID
        createdAt: String!
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
    }
`;