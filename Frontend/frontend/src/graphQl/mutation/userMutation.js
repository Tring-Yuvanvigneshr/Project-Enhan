import gql from "graphql-tag";

export const REGISTER_USER = gql`
    mutation RegisterUser($email: String!, $password: String!, $role: String!) {
        registerUser(email: $email, password: $password, role: $role) {
            id
            email
            role
            created_at
        }
    }
`;

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

export const HARD_DELETE_USER = gql`
    mutation HardDeleteUser($id: ID!) {
        hardDeleteUser(id: $id)
  }
`

