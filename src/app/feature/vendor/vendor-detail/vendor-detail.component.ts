import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Vendor } from '../../../model/vendor';
import { VendorService } from '../../../service/vendor.service';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrl: './vendor-detail.component.css'
})
export class VendorDetailComponent implements OnInit, OnDestroy {
  title: string = 'Vendor Edit';
  vendorId!: number;
  vendor!: Vendor;
  subscription!: Subscription;
  welcomeName: string = "";

  constructor(
    private vendorSvc: VendorService,
    private router: Router,
    private sysSvc: SystemService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.actRoute.params.subscribe((parms) => {
      this.vendorId = parms['id'];
    });

    this.subscription = this.vendorSvc.getById(this.vendorId).subscribe({
      next: (resp) => {
        this.vendor = resp;
      },
      error: (err) => {
        console.log('Error retrieving vendor: ', err);
      },
    });
  }

  delete() {
    this.vendorSvc.delete(this.vendorId).subscribe({
      next: (resp) => {
        this.vendor = resp as Vendor;
        this.router.navigateByUrl('/vendor-list');
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
