import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit, OnDestroy {
  title: string = "User Create";
  newUser: User = new User();
  subscription!: Subscription;
  reviewers: boolean[] = [true, false];
  admins: boolean[] = [true, false];

  constructor(private userSvc: UserService, private router: Router) { }

  ngOnInit(): void {

  }

  addUser() {
    // call userSvc.add method.
    this.subscription = this.userSvc.add(this.newUser).subscribe(
      (resp) => {
        // redirect to user-list component
        this.router.navigateByUrl("/user-list");
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
