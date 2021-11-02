import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UsersService} from "../_services/users.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private usersService: UsersService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let currentUser = this.usersService.currentUserValue;
    let currentToken = this.usersService.currentUserTokenValue;
    if (currentUser && currentToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `${currentToken}`
        }
      });
    }

    return next.handle(request);
  }
}
