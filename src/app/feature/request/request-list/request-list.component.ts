import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request.service';
import { Request } from '../../../model/request';
import { SystemService } from '../../../service/system.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.css'
})
export class RequestListComponent implements OnInit, OnDestroy {
  title: string = "Request-List!";

  requests!: Request[];
  subscription!: Subscription;

  welcomeName: string = "";

  constructor(
    private requestSvc: RequestService,
    private sysSvc: SystemService
  ) { }

  ngOnInit(): void {
    this.welcomeName = this.sysSvc.loggedInUser.firstName;

    this.loadRequests();
  }

  loadRequests(): void {
    this.subscription = this.requestSvc.list().subscribe(
      (resp) => {
        this.requests = resp;
      }
    );
  }



  delete(id: number): void {
    this.subscription = this.requestSvc.delete(id).subscribe({
      next: () => {
        this.loadRequests();
      },
      error: (err) => {
        console.error('Error deleting request for id:' + id);
        console.error(err);
      },
    });
  }



  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
