import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../../service/request.service';
import { SystemService } from '../../../service/system.service';
import { Request } from '../../../model/request';


@Component({
  selector: 'app-request-review',
  templateUrl: './request-review.component.html',
  styleUrl: './request-review.component.css'
})
export class RequestReviewComponent implements OnInit, OnDestroy {
  title: string = "Request-Review";

  requests!: Request[];
  subscription!: Subscription;
  userId!: number;

  welcomeName: string = "";

  constructor(
    private requestSvc: RequestService,
    private sysSvc: SystemService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;

    // this.subscription = this.actRoute.params.subscribe({
    //   next: (parms) => {
    //     this.userId = parms["userId"];

    //     this.loadRequests();
    //   }
    // })


    this.subscription = this.requestSvc.list().subscribe({
      next: (resp) => {
        // Filter requests to get only those with status 'REVIEW'
        this.requests = resp.filter(request => request.status === 'REVIEW' && request.userId !== this.sysSvc.loggedInUser.id);
        // .filter(request => request.status === 'REVIEW');
        console.log("Requests with status REVIEW:", this.requests);
      },
      error: (err) => {
        console.error("Error getting requests:", err);
      }
    });




  }

  loadRequests(): void {
    this.subscription = this.requestSvc.listReview(this.userId).subscribe({
      next: (resp) => {
        console.log("List-Review response:", resp);
        this.requests = resp;
        // .filter(request => request.status === 'REVIEW' && request.userId !== this.sysSvc.loggedInUser.id);

      },
      error: (err) => {
        console.error("List-Review: Error getting List-Review for userId: ", err + this.userId)
      }
    });
  }


  // // get userId from URL
  // this.subscription = this.actRoute.params.subscribe({
  //   next: (parms) => {

  //     console.log("Route parameters:", parms);
  //     const routeUserId = parms['userId'];
  //     const loggedInUserId = this.sysSvc.loggedInUser.id;


  //     if (routeUserId !== loggedInUserId) {
  //       console.log("routeUserId: " + routeUserId, ", loggedInUserId: " + loggedInUserId)
  //       this.userId = routeUserId;
  //       this.loadRequests();

  //     } else {
  //       console.error('User is not authorized to access this page');
  //       this.router.navigateByUrl('/**');
  //     }

  //   }

  // });




















  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
