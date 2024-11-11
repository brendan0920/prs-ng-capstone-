import { Component, OnDestroy, OnInit } from '@angular/core';
import { Request } from '../../../model/request';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from '../../../service/system.service';
import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';
import { UserLogin } from '../../../model/user-login';

@Component({
  selector: 'app-request-edit',
  templateUrl: './request-edit.component.html',
  styleUrl: './request-edit.component.css'
})
export class RequestEditComponent implements OnInit, OnDestroy {
  title: string = "Reqeust Edit";
  requestId!: number;
  request: Request = new Request();
  subscription!: Subscription;
  users: User[] = [];
  // userlogin!: UserLogin;
  deliveryModes: string[] = ["Pickup", "Via Mail"];
  welcomeName: string = "";

  constructor(
    private requestSvc: RequestService,
    private userSvc: UserService,
    private router: Router,
    private sysSvc: SystemService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    // get id from the url
    this.actRoute.params.subscribe(parms => {
      this.requestId = parms["id"]
      // get the request for the id
      this.subscription = this.requestSvc.getById(this.requestId).subscribe({
        next: (resp) => {
          this.request = resp;
        },
        error: (err) => {
          console.log("Error retrieving request for id: " + this.requestId, err);
        }
      });
    });

    // // populate user logged-in
    // this.subscription = this.userSvc.login(this.userlogin).subscribe({
    //   next: (resp) => {
    //     this.sysSvc.loggedInUser = resp;
    //   },
    //   error: (err) => {
    //     console.error("Request Edit Error: error loading loggin user." + err.message);
    //   }
    // });
  }

  save() {
    // call requestSvc.add method.
    this.subscription = this.requestSvc.edit(this.request).subscribe({
      next: (resp) => {
        // redirect to request-list component
        this.router.navigateByUrl("/request-list");
      },
      error: (err) => {
        console.error("Error editing request: " + err.message);
      }
    });
  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
