import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit, OnDestroy {
  title: string = 'User Edit';
  userId!: number;
  user!: User;
  subscription!: Subscription;
  welcomeName: string = "";

  constructor(
    private userSvc: UserService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private sysSvc: SystemService
  ) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.actRoute.params.subscribe((parms) => {
      this.userId = parms['id'];
    });

    this.subscription = this.userSvc.getById(this.userId).subscribe({
      next: (resp) => {
        this.user = resp;
      },
      error: (err) => {
        console.log('Error retrieving user: ', err);
      },
    });
  }

  delete() {
    this.userSvc.delete(this.userId).subscribe({
      next: (resp) => {
        this.user = resp as User;
        this.router.navigateByUrl('/user-list');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
