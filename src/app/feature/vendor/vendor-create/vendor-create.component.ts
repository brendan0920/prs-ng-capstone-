import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Vendor } from '../../../model/vendor';
import { VendorService } from '../../../service/vendor.service';

@Component({
  selector: 'app-vendor-create',
  templateUrl: './vendor-create.component.html',
  styleUrl: './vendor-create.component.css'
})
export class VendorCreateComponent implements OnInit, OnDestroy {
  title: string = "Vendor Create";
  newVendor: Vendor = new Vendor();
  subscription!: Subscription;

  constructor(private vendorSvc: VendorService, private router: Router) { }

  ngOnInit(): void {

  }

  addVendor() {
    // call vendorSvc.add method.
    this.subscription = this.vendorSvc.add(this.newVendor).subscribe(
      (resp) => {
        // redirect to vendor-list component
        this.router.navigateByUrl("/vendor-list");
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
