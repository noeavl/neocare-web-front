import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'http://localhost:8000/api/v1'

  constructor(private http: HttpClient) {}

  createAddress(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(`${this.apiUrl}/addresses`, data)
  }

  indexAddress(): Observable<any> {
    return this.http.get(`${this.apiUrl}/addresses`)
  }

  updateAddress(id: number, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.patch(`${this.apiUrl}/addresses/${id}`, data)
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/addresses/${id}`)
  }

  showAddress(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/addresses/${id}`)
  }
}
