import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'http://34.215.209.108/api/v1'

  constructor(private http: HttpClient) {}

  createAddress(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(`${this.apiUrl}/addresses`, data)
  }

  indexAddress(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/addresses?page=${page}`);
  }

  updateAddress(id: number, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.put(`${this.apiUrl}/addresses/${id}`, data)
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/addresses/${id}`)
  }

  showAddress(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/addresses/${id}`)
  }
}
