
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { LineItem } from '../../../model/line-item';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product';
import { LineItemService } from '../../../service/line-item.service';
import { ProductService } from '../../../service/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from '../../../service/system.service';
import { RequestService } from '../../../service/request.service';
import { Request } from '../../../model/request';

@Component({
  selector: 'app-line-item-create',
  templateUrl: './line-item-create.component.html',
  styleUrl: './line-item-create.component.css'
})
export class LineItemCreateComponent implements OnInit, OnDestroy {
  title: string = "Line-Item-Create";

  newLineItem: LineItem = new LineItem();
  subscription!: Subscription;
  requestId: number = 0;
  request!: Request;
  products: Product[] = [];
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

    // Retrieve requestId from the route and set it on newLineItem
    this.requestId = Number(this.actRoute.snapshot.paramMap.get('requestId'));
    // Make sure requestId is set here
    this.newLineItem.requestId = this.requestId;

    this.subscription = this.requestSvc.getById(this.requestId).subscribe({
      next: (resp) => {
        this.newLineItem.request = resp;
      },
      error: (err) => {
        console.error("Error getting request: ", err);
      }
    });

    // Load products for selection
    this.subscription = this.productSvc.list().subscribe({
      next: (resp) => {
        this.products = resp
      },
      error: (err) => {
        console.error("Error loading products:", err);
      }
    });
  }

  addLineItem(): void {
    console.log("Adding line item: ", this.newLineItem);

    this.newLineItem.requestId = this.requestId;
    this.newLineItem.productId = this.newLineItem.product.id;

    this.subscription = this.lineItemSvc.add(this.newLineItem).subscribe({
      next: (resp) => {
        console.log("Line item added: ", resp);
        this.newLineItem = resp;

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

      },
      error: (err) => {
        console.log("Erro adding line item: ", err);
      }
    });

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
