export const authTypeDefs = /* GraphQL */ `
    type Query {
        _empty: String
    }
    type User {
        id: ID!
        name: String!
        email: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Mutation {
        signup(name: String!, email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
    }
`;