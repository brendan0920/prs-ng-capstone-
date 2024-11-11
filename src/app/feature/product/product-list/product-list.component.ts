import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product';
import { ProductService } from '../../../service/product.service';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  title: string = "Product-List!";

  products: Product[] | undefined;
  subscription!: Subscription;

  welcomeName: string = "";

  constructor(private productSvc: ProductService, private sysSvc: SystemService) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;

    this.subscription = this.productSvc.list().subscribe(
      (resp) => {
        this.products = resp;
      }
    );
  }


  delete(id: number): void {
    this.subscription = this.productSvc.delete(id).subscribe({
      next: () => {
        // only after receiving successful response, refresh the list.
        this.subscription = this.productSvc.list().subscribe((resp) => {
          this.products = resp;
        });
      },
      error: (err) => {
        console.error('Error deleting product for id:' + id);
        console.error(err);
      },
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
