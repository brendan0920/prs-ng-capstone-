import { Component, OnDestroy, OnInit } from '@angular/core';
import { LineItem } from '../../../model/line-item';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { LineItemService } from '../../../service/line-item.service';
import { ActivatedRoute } from '@angular/router';
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
    private sysSvc: SystemService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;

    // get requestId from URL
    this.subscription = this.actRoute.params.subscribe({
      next: (parms) => {
        this.requestId = parms['requestId'];
        this.getForRequestId();

      }
    });

  }

  delete(id: number): void {
    this.subscription = this.lineItemSvc.delete(id).subscribe({
      next: () => {
        // refresh the list.
        this.getForRequestId();

      },
      error: (err) => {
        console.error('Error deleting lineItem for id:' + id, err);
      }
    });
  }

  submitReview(id: number): void {
    this.subscription = this.requestSvc.submitReview(id).subscribe({
      next: (resp) => {
        console.log("Review submmited!", resp);

        this.getForRequestId();
      },
      error: (err) => {
        console.error("Error submitting review:", err);
      }
    });
  }

  getForRequestId(): void {
    // get the request for requestId
    // this.request = new Request();

    this.subscription = this.requestSvc.getById(this.requestId).subscribe({
      next: (resp) => {
        console.log("Refresh Request:", resp);
        this.request = resp;
      },
      error: (err) => {
        console.error("Request-LineItems: Error getting request for id: ", err + this.requestId);
      }
    });

    // get lineItems for the requestId
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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
