import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../_services/users.service";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private readonly notifier: NotifierService;
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
    if (this.usersService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() { return this.registerForm.controls; }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (this.registerForm.invalid) {
      this.loading = false;
      return;
    }
    this.usersService.register(this.f.email.value, this.f.password.value)
      .subscribe(({ data }) => {
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      }, (error) => {
        this.loading = false;
        this.notifier.notify('error', error);
      });
  }
}
