import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product';
import { ProductService } from '../../../service/product.service';
import { VendorService } from '../../../service/vendor.service';
import { Vendor } from '../../../model/vendor';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit, OnDestroy {
  title: string = "Product Edit";
  product: Product = new Product();
  productId!: number;
  subscription!: Subscription;
  vendors: Vendor[] = [];

  constructor(
    private productSvc: ProductService,
    private vendorSvc: VendorService,
    private router: Router,
    private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // get id from the url
    this.actRoute.params.subscribe(parms => {
      this.productId = parms["id"]
      // get product for productId
      this.subscription = this.productSvc.getById(this.productId).subscribe({
        next: (resp) => {
          this.product = resp;
        },
        error: (err) => {
          console.log("Error retrieving product for id: " + this.productId, err);
        }
      });
    });

    // get list of vendors
    this.subscription = this.vendorSvc.list().subscribe({
      next: (resp) => {
        this.vendors = resp;
      },
      error: (err) => {
        console.log("Product Edit Error: error retrieving vendors." + err.message);
      }
    });
  }

  save() {
    // call productSvc.add method.
    this.subscription = this.productSvc.edit(this.product).subscribe({
      next: (resp) => {
        // redirect to product-list component
        this.router.navigateByUrl("/product-list");
      },
      error: (err) => {
        console.error("Error editing product: " + err.message);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  compVendor(a: Vendor, b: Vendor): boolean {
    return a && b && a.id == b.id;
  }

}
