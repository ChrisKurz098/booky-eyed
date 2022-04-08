// import the gql tagged template function
const { gql } = require('apollo-server-express');

 const typeDefs = gql`
 type Book {
  authors: [String]
  description: String
  bookId: String
  image: String
  link: String
  title: String

}

type User {
  _id: ID!
  username: String
  email: String
  password: String
  savedBooks: [Book]
}

type Auth {
  token: ID!
  user: User
}
type Query {
  getSingleUser(_id: ID!): User
}

type Mutation {
  login(username: String, email: String, password: String!): Auth
  createUser(username: String!, email: String!, password: String!): Auth
  saveBook( bookId: String!): User
  deleteBook( bookId: String!): User
}
`;

//export the typeDefs
module.exports = typeDefs;