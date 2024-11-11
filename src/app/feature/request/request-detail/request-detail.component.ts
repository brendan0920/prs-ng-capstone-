import { Component, OnDestroy, OnInit } from '@angular/core';
import { Request } from '../../../model/request';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.css'
})
export class RequestDetailComponent implements OnInit, OnDestroy {
  title: string = 'Request Detail';
  requestId!: number;
  request!: Request;
  subscription!: Subscription;
  welcomeName: string = "";

  constructor(
    private requestSvc: RequestService,
    private router: Router,
    private sysSvc: SystemService,
    private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;
    this.actRoute.params.subscribe((parms) => {
      this.requestId = parms['id'];
    });

    this.subscription = this.requestSvc.getById(this.requestId).subscribe({
      next: (resp) => {
        this.request = resp;
      },
      error: (err) => {
        console.error('Error retrieving request: ', err);
      },
    });
  }

  delete() {
    this.subscription = this.requestSvc.delete(this.requestId).subscribe({
      next: (resp) => {
        this.request = resp as Request;
        this.router.navigateByUrl('/request-list');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
