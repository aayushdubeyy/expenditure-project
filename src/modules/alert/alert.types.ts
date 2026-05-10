export const alertTypeDefs = /* GraphQL */ `
    type Alert {
        id: ID!
        type: String!
        title: String!
        message: String!
        read: Boolean!
        createdAt: String!
    }

    extend type Query {
        getAlerts: [Alert!]!
    }

    extend type Mutation {
        markAlertRead(alertId: ID!): Boolean!
    }
`;