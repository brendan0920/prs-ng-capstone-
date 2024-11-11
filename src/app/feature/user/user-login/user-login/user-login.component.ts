import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../../model/user';
import { UserLogin } from '../../../../model/user-login';
import { SystemService } from '../../../../service/system.service';
import { UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent implements OnInit, OnDestroy {
  title: string = "User Login";
  userLogin: UserLogin = new UserLogin();
  message?: string = undefined;
  subscription!: Subscription;

  constructor(
    private userSvc: UserService,
    private router: Router,
    private sysSvc: SystemService
  ) { }

  ngOnInit(): void {
    // invalidate the current loggedInUser
    this.sysSvc.loggedInUser = new User();
    // for testing purposes
    this.userLogin.username = "bkeam";
    this.userLogin.password = "bk1234";

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  login() {
    this.subscription = this.userSvc.login(this.userLogin).subscribe({
      next: (resp) => {
        this.sysSvc.loggedInUser = resp;
        this.router.navigateByUrl("/user-list");
      },
      error: (err) => {
        this.message = "Invalid username/password. Please try again.";
      }
    });
  }

}
