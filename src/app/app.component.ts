import { Component } from '@angular/core';
import {User} from "./models/user";
import {Router} from "@angular/router";
import {UsersService} from "./_services/users.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUser!: User | null;

  constructor(
    private router: Router,
    private usersService: UsersService
  ) {
    this.usersService.currentUser.subscribe(user => this.currentUser = user);
  }
  logout() {
    this.usersService.logout();
    this.router.navigate(['/login']);
  }
}
