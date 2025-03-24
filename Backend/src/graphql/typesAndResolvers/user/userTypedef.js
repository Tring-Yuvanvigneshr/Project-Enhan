const { gql } = require("graphql-tag");

const user_typedef = gql`
    type User {
        id: ID!
        email: String!
        role: String!
        created_at: String
    }
  
    type AuthPayload {
        token: String!
        user: User!
    }



    extend type Query {
        users: [User]
    }


    extend type Mutation {
        registerUser(email: String!, password: String!, role: String!): User
        signIn(email: String!, password: String!): AuthPayload
        hardDeleteUser(id: ID!): Boolean!
    }
`

module.exports = user_typedef;