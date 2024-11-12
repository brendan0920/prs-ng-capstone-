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

  newRequest: Request = new Request();
  requests!: Request[];
  subscription!: Subscription;
  userId!: number;

  welcomeName: string = "";

  constructor(
    private requestSvc: RequestService,
    private sysSvc: SystemService,
  ) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;

    this.userId = this.sysSvc.loggedInUser.id;
    //this.newRequest.userId = this.newRequest.user.id;

    this.subscription = this.requestSvc.listReview(this.userId).subscribe({
      next: (resp) => {
        this.requests = resp;
      },
      error: (err) => {
        console.error("Error getting requests:", err);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
