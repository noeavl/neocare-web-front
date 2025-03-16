import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class IncubatorsService {
  private apiUrl = 'http://34.215.209.108/api/v1'

  constructor(private http: HttpClient) { }

  index(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/incubators?page=${page}`)
  }

  show(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/incubators/` + id)
  }
  
  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/incubators`, data)
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/incubators/` + id, data)
  }
}
