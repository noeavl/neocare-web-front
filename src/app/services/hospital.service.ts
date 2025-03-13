import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private apiUrl = 'http://34.215.209.108/api/v1'

  constructor(private http: HttpClient) { }

  index(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/hospitals?page=${page}`)
  }

}
