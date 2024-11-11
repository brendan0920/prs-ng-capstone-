
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { LineItem } from '../../../model/line-item';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product';
import { LineItemService } from '../../../service/line-item.service';
import { ProductService } from '../../../service/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from '../../../service/system.service';

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
  products: Product[] = [];
  lineItems!: LineItem[];



  welcomeName: string = "";

  constructor(
    private lineItemSvc: LineItemService,
    private productSvc: ProductService,
    private router: Router,
    private sysSvc: SystemService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;

    // Retrieve requestId from the route and set it on newLineItem
    this.requestId = Number(this.actRoute.snapshot.paramMap.get('requestId'));
    // Make sure requestId is set here
    this.newLineItem.requestId = this.requestId;



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
        console.log("Line Item added: ", resp);

        // this.router.navigateByUrl("/lines-for-req/:requestId");
        this.router.navigateByUrl('/lines-for-req/' + this.newLineItem.requestId);

      },
      error: (err) => {
        console.error("Error adding line item:", err);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
