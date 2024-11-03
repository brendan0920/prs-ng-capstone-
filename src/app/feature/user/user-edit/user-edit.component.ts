import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit, OnDestroy {
  title: string = "User Edit";
  userId!: number;
  user!: User;
  subscription!: Subscription;
  reviewers: boolean[] = [true, false];
  admins: boolean[] = [true, false];

  constructor(private userSvc: UserService, private router: Router, private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // get id from the url
    this.actRoute.params.subscribe(parms => {
      this.userId = parms["id"]
    });

    // get the user for the id from the data
    this.subscription = this.userSvc.getById(this.userId).subscribe({
      next: (resp) => {
        this.user = resp;
      },
      error: (err) => {
        console.log("Error retrieving user: ", err);
      }
    });
  }

  save() {
    this.userSvc.edit(this.user).subscribe(
      resp => {
        this.user = resp as User;
        this.router.navigateByUrl("/user-list");
      },
      err => { console.log(err); }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
