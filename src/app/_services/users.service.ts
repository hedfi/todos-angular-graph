import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {AuthUser, User} from "../models/user";
import {TokenStorageService} from "./token-storage.service";

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
  private currentUserSubject: BehaviorSubject<User  | null>;
  public currentUser: Observable<User  | null>;
  private currentUserTokenSubject: BehaviorSubject<string  | null>;
  public currentUserToken: Observable<string | null>;

  constructor(private apollo: Apollo, private tokenStorageService: TokenStorageService) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.tokenStorageService.getUser());
    this.currentUserTokenSubject = new BehaviorSubject<string | null>(<string>this.tokenStorageService.getToken());

    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUserToken = this.currentUserTokenSubject.asObservable();
  }
  login(email: string, password: string) {
    return this.apollo.mutate({
      mutation: LOGIN_POST,
      variables: {
        email,
        password
      }
    }).pipe(map(authUser => {
      const currentUser = authUser.data as AuthUser
      this.tokenStorageService.saveToken(currentUser.loginUser.token)
      this.tokenStorageService.saveUser(currentUser.loginUser.user)
      this.currentUserSubject.next(currentUser.loginUser.user);
      this.currentUserTokenSubject.next(currentUser.loginUser.token);
      return authUser;
    }));
  }
  logout() {
    this.tokenStorageService.signOut()
    this.currentUserSubject.next(null);
    this.currentUserTokenSubject.next(null);
  }
}
