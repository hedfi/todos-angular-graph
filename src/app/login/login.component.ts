import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../_services/users.service";

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  errors: Alert[] = [] ;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get f() { return this.loginForm.controls; }
  close(alert: Alert) {
    this.errors.splice(this.errors.indexOf(alert), 1);
  }
  onSubmit() {
    this.errors = []
    this.submitted = true;
    this.loading = true;
    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    }
    this.usersService.login(this.f.email.value, this.f.password.value)
      .subscribe(({ data }) => {
        this.loading = false;
        console.log('got data', data);
      }, (error) => {
        this.loading = false;
        this.errors.push(error)
      });
  }
}
