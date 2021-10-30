import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import {AuthUser} from "../models/user";

const LOGIN_POST = gql`
  mutation {
    loginUser(userInput:{email:"hedfi", password:"password"}) {
      user {
        id
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
  login(postId: string) {
    return this.apollo.mutate({
      mutation: LOGIN_POST,
      variables: {
        postId
      }
    })
  }
}
