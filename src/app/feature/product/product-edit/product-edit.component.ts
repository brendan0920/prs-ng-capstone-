import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit, OnDestroy {
  title: string = "Product Edit";
  productId!: number;
  product!: Product;
  subscription!: Subscription

  constructor(private productSvc: ProductService, private router: Router, private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // get id from the url
    this.actRoute.params.subscribe(parms => {
      this.productId = parms["id"]
    });

    // get the product for the id from the data
    this.subscription = this.productSvc.getById(this.productId).subscribe({
      next: (resp) => {
        this.product = resp;
      },
      error: (err) => {
        console.log("Error retrieving product: ", err);
      }
    });
  }

  save() {
    this.productSvc.edit(this.product).subscribe(
      resp => {
        this.product = resp as Product;
        this.router.navigateByUrl("/product-list");
      },
      err => { console.log(err); }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
