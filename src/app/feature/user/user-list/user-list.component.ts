import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../../service/user.service';
import { User } from '../../../model/user';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, OnDestroy {
  title: string = "User-list!";

  users: User[] | undefined;
  subscription!: Subscription;
  welcomeName: string = "";

  constructor(
    private userSvc: UserService,
    private sysSvc: SystemService
  ) { }


  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.subscription = this.userSvc.list().subscribe(
      (resp) => {
        this.users = resp;
      }
    );

  }

  delete(id: number): void {
    this.subscription = this.userSvc.delete(id).subscribe({
      next: () => {
        // only after receiving successful response, refresh the list.
        this.subscription = this.userSvc.list().subscribe((resp) => {
          this.users = resp;
        });
      },
      error: (err) => {
        console.error('Error deleting movie for id:' + id);
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
