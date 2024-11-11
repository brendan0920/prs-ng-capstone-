import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LineItem } from '../../../model/line-item';
import { LineItemService } from '../../../service/line-item.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-line-item-list',
  templateUrl: './line-item-list.component.html',
  styleUrl: './line-item-list.component.css'
})
export class LineItemListComponent implements OnInit, OnDestroy {
  title: string = "LineItem-List!";
  requestId!: number;
  lineItems: LineItem[] = [];
  subscription!: Subscription;

  constructor(private lineItemSvc: LineItemService, private actRoute: ActivatedRoute) {
    this.requestId = +(this.actRoute.snapshot.paramMap.get('requestId') ?? 0);
  }

  ngOnInit(): void {
    this.subscription = this.lineItemSvc.getByReqId(this.requestId).subscribe({
      next: (resp) => {
        this.lineItems = resp
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  delete(id: number): void {
    this.subscription = this.lineItemSvc.delete(this.requestId).subscribe({
      // Refresh the list on delete success
      next: () => {
        this.subscription = this.lineItemSvc.getByReqId(this.requestId).subscribe({
          next: (resp) => {
            this.lineItems = resp
          },
          error: (err) => {
            console.error(err);
          }
        });
      },
      error: (err) => {
        console.error('Error deleting lineItem for id:', id, err);
      }
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
