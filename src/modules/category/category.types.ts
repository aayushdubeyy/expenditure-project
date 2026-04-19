export const categoryTypeDefs = /* GraphQL */ `
    type Category {
        id: ID!
        name: String!
        userId: ID
    }

    extend type Mutation {
        createCategory(name: String!): Category!
    }

    extend type Query {
        getCategories: [Category!]!
    }
`;