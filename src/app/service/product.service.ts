import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../model/product';

const URL = "http://localhost:5041/api/Products";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  list(): Observable<Product[]> {
    return this.http.get(URL) as Observable<Product[]>;
  }

  // add(product: Product) method
  add(product: Product): Observable<Product> {
    return this.http.post(URL, product) as Observable<Product>;
  }

  // delete(id: number) method
  delete(id: number): Observable<any> {
    return this.http.delete(URL + "/" + id);
  }

  // getById(id: number) method
  getById(id: number): Observable<Product> {
    return this.http.get(URL + "/" + id) as Observable<Product>;
  }

  // edit(product: Product) method
  edit(product: Product): Observable<Product> {
    return this.http.put(URL + '/' + product.id, product) as Observable<Product>;
  }
}
