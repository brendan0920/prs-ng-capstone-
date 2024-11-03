import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Vendor } from '../../../model/vendor';
import { VendorService } from '../../../service/vendor.service';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css'
})
export class VendorListComponent implements OnInit, OnDestroy {
  title: string = "Vendor-List!";

  vendors: Vendor[] | undefined;
  subscription!: Subscription;

  constructor(private vendorSvc: VendorService) { }

  ngOnInit(): void {
    this.subscription = this.vendorSvc.list().subscribe(
      (resp) => {
        this.vendors = resp;
      }
    );
  }

  delete(id: number): void {
    this.subscription = this.vendorSvc.delete(id).subscribe({
      next: () => {
        // only after receiving successful response, refresh the list.
        this.subscription = this.vendorSvc.list().subscribe((resp) => {
          this.vendors = resp;
        });
      },
      error: (err) => {
        console.error('Error deleting vendor for id:' + id);
        console.error(err);
      },
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
