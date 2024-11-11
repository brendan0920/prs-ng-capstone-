import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Vendor } from '../../../model/vendor';
import { VendorService } from '../../../service/vendor.service';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-vendor-edit',
  templateUrl: './vendor-edit.component.html',
  styleUrl: './vendor-edit.component.css'
})
export class VendorEditComponent implements OnInit, OnDestroy {
  title: string = "Vendor Edit";
  vendorId!: number;
  vendor!: Vendor;
  subscription!: Subscription
  welcomeName: string = "";

  constructor(
    private vendorSvc: VendorService,
    private router: Router,
    private sysSvc: SystemService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    // get id from the url
    this.actRoute.params.subscribe(parms => {
      this.vendorId = parms["id"]
    });

    // get the vendor for the id from the data
    this.subscription = this.vendorSvc.getById(this.vendorId).subscribe({
      next: (resp) => {
        this.vendor = resp;
      },
      error: (err) => {
        console.log("Error retrieving vendor: ", err);
      }
    });
  }

  save() {
    this.vendorSvc.edit(this.vendor).subscribe({
      next: (resp) => {
        this.vendor = resp as Vendor;
        this.router.navigateByUrl("/vendor-list");
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
