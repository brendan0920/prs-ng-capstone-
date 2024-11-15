import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from '../model/request';
import { User } from '../model/user';

const URL = "http://localhost:5041/api/Requests";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  list(): Observable<Request[]> {
    return this.http.get(URL) as Observable<Request[]>;
  }

  // add(request: Request) method
  add(request: Request): Observable<Request> {
    return this.http.post(URL, request) as Observable<Request>;
  }

  // delete(id: number) method
  delete(id: number): Observable<Request> {
    return this.http.delete(URL + "/" + id) as Observable<Request>;
  }

  // getById(id: number) method
  getById(id: number): Observable<Request> {
    return this.http.get(URL + "/" + id) as Observable<Request>;
  }

  // edit(request: Request) method
  edit(request: Request): Observable<Request> {
    return this.http.put(URL + "/" + request.id, request) as Observable<Request>;
  }

  submitReview(id: number): Observable<Request> {
    return this.http.put(URL + "/submit-review/" + id, {}) as Observable<Request>;
  }

  listReview(userId: number): Observable<Request[]> {
    return this.http.get(URL + "/list-review/" + userId) as Observable<Request[]>;
  }

  approve(requestId: number): Observable<Request> {
    return this.http.put(URL + "/approve/" + requestId, {}) as Observable<Request>;
  }

  reject(request: Request): Observable<Request> {
    return this.http.put(URL + "/reject/" + request.id, request) as Observable<Request>;
  }

}