import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private apiUrl = 'http://34.215.209.108/api/v1'

  constructor(private http: HttpClient) { }

  index(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms?page=${page}`)
  }

  getRoomsByHospital(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms?hospital_id=${id}`)
  }

  show(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms/` + id)
  }
  
  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/rooms`, data)
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/rooms/` + id, data)
  }
}
