import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import {AuthUser} from "../models/user";

const LOGIN_POST = gql`
  mutation LoginUser($email: String!, $password: String!) {
      loginUser(userInput: {email: $email, password: $password}) {
        user {
          id
          email
          createdAt
          updatedAt
        }
        token
      }
    }
`;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private apollo: Apollo) {}
  login(email: string, password: string) {
    return this.apollo.mutate({
      mutation: LOGIN_POST,
      variables: {
        email,
        password
      }
    })
  }
}
