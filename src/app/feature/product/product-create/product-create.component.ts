import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  title: string = "Product Create";
  newProduct: Product = new Product();
  subscription!: Subscription;


  constructor(private productSvc: ProductService, private router: Router) { }

  ngOnInit(): void {

  }

  addProduct() {
    // call productSvc.add method.
    this.subscription = this.productSvc.add(this.newProduct).subscribe(
      (resp) => {
        // redirect to product-list component
        this.router.navigateByUrl("/product-list");
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
