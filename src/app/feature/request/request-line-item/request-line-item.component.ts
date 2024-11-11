import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { LineItem } from '../../../model/line-item';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { LineItemService } from '../../../service/line-item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Request } from '../../../model/request';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-request-line-item',
  templateUrl: './request-line-item.component.html',
  styleUrl: './request-line-item.component.css'
})
export class RequestLineItemComponent implements OnInit, OnDestroy {
  title: string = "Purchase Request Line Items";

  request!: Request;
  requestId!: number;
  lineItems: LineItem[] = [];
  subscription?: Subscription;

  welcomeName: string = "";

  constructor(
    private requestSvc: RequestService,
    private lineItemSvc: LineItemService,
    private router: Router,
    private sysSvc: SystemService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;

    // get requestId from URL
    this.subscription = this.actRoute.params.subscribe({
      next: (parms) => {
        this.requestId = parms['requestId'];

        this.getRequestDetail();
      }
    });
  }

  delete(id: number): void {
    this.subscription = this.lineItemSvc.delete(id).subscribe({
      next: () => {
        // only after receiving successful response, refresh the list.
        this.getRequestDetail();
      },
      error: (err) => {
        console.error('Error deleting lineItem for id:' + id);
        console.error(err);
      },
    });
  }

  getRequestDetail(): void {
    // get the request for requestId
    this.subscription = this.requestSvc.getById(this.requestId).subscribe({
      next: (resp) => {
        console.log("Request response:", resp);
        this.request = resp;
      },
      error: (err) => {
        console.error("Request-LineItems: Error getting request for id: ", err + this.requestId);
      }
    });

    // get lineItems for the request
    this.subscription = this.lineItemSvc.getByReqId(this.requestId).subscribe({
      next: (resp) => {
        console.log("Line items response:", resp);
        this.lineItems = resp;
      },
      error: (err) => {
        console.error("Request-LineItems: Error getting lineItems for requestId: ", err + this.requestId)
      }
    });
  }

  calcLineTotal(lineItem: LineItem): number {
    return lineItem.product.price * lineItem.quantity;
  }

  submitReview(): void {
    this.subscription = this.requestSvc.submitReview(this.requestId).subscribe({
      next: (resp) => {
        console.log("Review submmited!", resp);
        this.getRequestDetail();
        this.router.navigateByUrl("request-list");
      },
      error: (err) => {
        console.error("Error submitting review:", err);
      }
    });

  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
