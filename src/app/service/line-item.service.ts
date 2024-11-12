import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LineItem } from '../model/line-item';
import { Request } from '../model/request';

const URL = "http://localhost:5041/api/LineItems";

@Injectable({
  providedIn: 'root'
})
export class LineItemService {

  constructor(private http: HttpClient) { }

  list(): Observable<LineItem[]> {
    return this.http.get(URL) as Observable<LineItem[]>;
  }

  // add(lineItem: LineItem) method
  add(lineItem: LineItem): Observable<LineItem> {
    console.log("lineitems service add: ", lineItem);
    console.log("URL = ", URL);
    return this.http.post(URL, lineItem) as Observable<LineItem>;
  }

  // delete(id: number) method
  delete(id: number): Observable<any> {
    return this.http.delete(URL + "/" + id);
  }

  // getById(id: number) method
  getById(id: number): Observable<LineItem> {
    return this.http.get(URL + "/" + id) as Observable<LineItem>;
  }

  // edit(lineItem: LineItem) method
  edit(lineItem: LineItem): Observable<LineItem> {
    return this.http.put(URL + '/' + lineItem.id, lineItem) as Observable<LineItem>;
  }

  getByReqId(requestId: number): Observable<LineItem[]> {
    return this.http.get(URL + "/lines-for-req/" + requestId) as Observable<LineItem[]>;
  }


}
