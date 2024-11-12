import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { SystemService } from '../../../service/system.service';
import { Request } from '../../../model/request';
import { Router, ActivatedRoute } from '@angular/router';
import { LineItem } from '../../../model/line-item';
import { LineItemService } from '../../../service/line-item.service';

@Component({
  selector: 'app-request-approve-reject',
  templateUrl: './request-approve-reject.component.html',
  styleUrl: './request-approve-reject.component.css'
})
export class RequestApproveRejectComponent implements OnInit, OnDestroy {
  title: string = "Purchase Request Approve/Reject";
  reasonForReject: string = "";

  requests: Request[] = [];
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

    // get request id from url
    this.subscription = this.actRoute.params.subscribe({
      next: (parms) => {
        this.requestId = parms['requestId'];
      }
    });

    // get request for requesId
    this.subscription = this.requestSvc.getById(this.requestId).subscribe({
      next: (resp) => {
        console.log("Request response:", resp);
        this.request = resp;
      },
      error: (err) => {
        console.error("Request-LineItems: Error getting request for id: ", err + this.requestId);
      }
    });

    // get lineitem for requestId
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




  approve(): void {


    this.subscription = this.requestSvc.approve(this.requestId).subscribe({
      next: (resp) => {
        // get request for requesId
        this.subscription = this.requestSvc.getById(this.requestId).subscribe({
          next: (resp) => {
            console.log("Request response:", resp);
            this.request = resp;
          },
          error: (err) => {
            console.error("Request-LineItems: Error getting request for id: ", err + this.requestId);
          }
        });

        // get lineitem for requestId
        this.subscription = this.lineItemSvc.getByReqId(this.requestId).subscribe({
          next: (resp) => {
            console.log("Line items response:", resp);
            this.lineItems = resp;
          },
          error: (err) => {
            console.error("Request-LineItems: Error getting lineItems for requestId: ", err + this.requestId)
          }
        });



      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  reject(): void {
    this.request.reasonForRejection = this.reasonForReject;

    this.subscription = this.requestSvc.reject(this.request).subscribe({
      next: (resp) => {
        // get request for requesId
        this.subscription = this.requestSvc.getById(this.requestId).subscribe({
          next: (resp) => {
            console.log("Request response:", resp);
            this.request = resp;
          },
          error: (err) => {
            console.error("Request-LineItems: Error getting request for id: ", err + this.requestId);
          }
        });

        // get lineitem for requestId
        this.subscription = this.lineItemSvc.getByReqId(this.requestId).subscribe({
          next: (resp) => {
            console.log("Line items response:", resp);
            this.lineItems = resp;
          },
          error: (err) => {
            console.error("Request-LineItems: Error getting lineItems for requestId: ", err + this.requestId)
          }
        });

        this.reasonForReject = "";
      },
      error: (err) => {
        console.log(err);
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
