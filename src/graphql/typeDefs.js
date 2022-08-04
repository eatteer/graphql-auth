import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    password: String!
    roles: [String]!
    permissions: [String]!
  }

  type Query {
    me: User
    user(id: ID!): User
    allUsers: [User]
  }
` 