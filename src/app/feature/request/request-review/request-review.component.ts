import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { SystemService } from '../../../service/system.service';
import { Request } from '../../../model/request';
import { LineItemService } from '../../../service/line-item.service';
import { LineItem } from '../../../model/line-item';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-request-review',
  templateUrl: './request-review.component.html',
  styleUrl: './request-review.component.css'
})
export class RequestReviewComponent implements OnInit, OnDestroy {
  title: string = "Request-Review";

  newLineItem: LineItem = new LineItem();
  lineItems!: LineItem[];
  newRequest: Request = new Request();
  requests!: Request[];
  request!: Request;
  requestId!: number;
  subscription!: Subscription;
  userId!: number;

  welcomeName: string = "";

  constructor(
    private requestSvc: RequestService,

    private sysSvc: SystemService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;

    this.userId = this.sysSvc.loggedInUser.id;
    //this.newRequest.userId = this.newRequest.user.id;

    // // Retrieve requestId from the route and set it on newLineItem
    // this.requestId = Number(this.actRoute.snapshot.paramMap.get('requestId'));
    // // set requestId 
    // this.newLineItem.requestId = this.requestId;

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
