export const creditLineTypeDefs = /* GraphQL */ `
  type CreditLine {
    id: ID!
    name: String!
    totalLimit: Float!
    currentUsage: Float!
  }

  extend type Query {
    getCreditLines: [CreditLine!]!
  }

  extend type Mutation {
    createCreditLine(name: String!, totalLimit: Float!): CreditLine!
  }
`;