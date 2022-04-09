import { gql } from '@apollo/client';

export const SAVE_BOOK = gql`
mutation saveBook($bookData: newBook!) {
    saveBook( bookData: $bookData) {
        _id
        username
        email
        savedBooks {
            authors
            description
            bookId
            image
            link
            title
        }
    }
  }
`;


export const LOGIN_USER = gql`
mutation login($username: String, $email: String, $password: String!) {
    login(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

