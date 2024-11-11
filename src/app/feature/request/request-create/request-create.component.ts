import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { Request } from '../../../model/request';
import { UserService } from '../../../service/user.service';
import { SystemService } from '../../../service/system.service';


@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrl: './request-create.component.css'
})
export class RequestCreateComponent implements OnInit, OnDestroy {
  title: string = "Request Create";
  newRequest: Request = new Request();
  subscription!: Subscription;
  users: User[] = [];

  deliveryModes: string[] = ["Pickup", "Via Mail"];
  welcomeName: string = "";


  constructor(
    private requestSvc: RequestService,
    private userSvc: UserService,
    private sysSvc: SystemService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // logged-in user's name to display
    this.welcomeName = this.sysSvc.loggedInUser.firstName;

    // the logged-in user to the newRequest object (user property)
    this.newRequest.user = this.sysSvc.loggedInUser;

    // list of users
    this.subscription = this.userSvc.list().subscribe({
      next: (resp) => {
        this.users = resp;
      },
      error: (err) => {
        console.error("Request Create Error: error loading users." + err.message);
      }
    });

  }

  addRequest() {
    // userId is set from the logged-in user
    // Set the userId before submitting the request
    this.newRequest.userId = this.sysSvc.loggedInUser.id;

    // call requestSvc.add method.
    this.subscription = this.requestSvc.add(this.newRequest).subscribe({
      next: (resp) => {
        // redirect to request-list component
        this.router.navigateByUrl("/request-list");
      },
      error: (err) => {
        console.error("Error creating request: " + err.message);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}


