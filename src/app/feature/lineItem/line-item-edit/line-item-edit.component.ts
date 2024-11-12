import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LineItem } from '../../../model/line-item';
import { Product } from '../../../model/product';
import { LineItemService } from '../../../service/line-item.service';
import { ProductService } from '../../../service/product.service';
import { RequestService } from '../../../service/request.service';
import { SystemService } from '../../../service/system.service';
import { Request } from '../../../model/request';

@Component({
  selector: 'app-line-item-edit',
  templateUrl: './line-item-edit.component.html',
  styleUrl: './line-item-edit.component.css'
})
export class LineItemEditComponent implements OnInit, OnDestroy {
  title: string = "Line Item Edit";

  newLineItem: LineItem = new LineItem();
  subscription!: Subscription;
  requestId: number = 0;
  lineItemId: number = 0;
  products: Product[] = [];
  request!: Request;
  lineItems!: LineItem[];

  welcomeName: string = "";

  constructor(
    private lineItemSvc: LineItemService,
    private productSvc: ProductService,
    private sysSvc: SystemService,
    private requestSvc: RequestService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;

    // get id from the url
    this.actRoute.params.subscribe({
      next: (parms) => {
        this.lineItemId = parms["id"]
        // get the lineItem for the id
        this.subscription = this.lineItemSvc.getById(this.lineItemId).subscribe({
          next: (resp) => {
            this.newLineItem = resp;
          },
          error: (err) => {
            console.error("Error getting lineItems for id : " + this.lineItemId, err);
          }

        });
      }
    });

    // get list of products
    this.subscription = this.productSvc.list().subscribe({
      next: (resp) => {
        this.products = resp
      },
      error: (err) => {
        console.error("Error loading products:", err);
      }
    });
  }

  save(): void {
    console.log("Editing line item: ", this.newLineItem);

    this.newLineItem.id = this.lineItemId;
    this.newLineItem.productId = this.newLineItem.product.id;

    this.subscription = this.lineItemSvc.edit(this.newLineItem).subscribe({
      next: (resp) => {
        console.log("Line item edited: ", resp);
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

        this.router.navigateByUrl("/lines-for-req/" + this.newLineItem.requestId);
        // "/lines-for-req/{{ newLineItem.requestId }}"
      },
      error: (err) => {
        console.log("Erro adding line item: ", err);
      }
    });
  }

  compProduct(a: Product, b: Product): boolean {
    return a && b && a.id == b.id;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}