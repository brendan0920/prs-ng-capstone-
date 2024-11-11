import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product';
import { ProductService } from '../../../service/product.service';
import { Vendor } from '../../../model/vendor';
import { VendorService } from '../../../service/vendor.service';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  title: string = "Product Create";

  newProduct: Product = new Product();
  subscription!: Subscription;
  vendors: Vendor[] = [];

  welcomeName: string = "";

  constructor(
    private productSvc: ProductService,
    private vendorSvc: VendorService,
    private sysSvc: SystemService,
    private router: Router) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;

    // populate list of vendors
    this.subscription = this.vendorSvc.list().subscribe({
      next: (resp) => {
        this.vendors = resp;
      },
      error: (err) => {
        console.error("Product Create Error: error loading vendors." + err.message);
      }
    });
  }

  addProduct() {
    // call productSvc.add method.
    this.subscription = this.productSvc.add(this.newProduct).subscribe({
      next: (resp) => {
        // redirect to product-list component
        this.router.navigateByUrl("/product-list");
      },
      error: (err) => {
        console.error("Error creating product: " + err.message);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
