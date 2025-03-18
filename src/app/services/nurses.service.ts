import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NursesService {
  private apiUrl = 'http://34.215.209.108/api/v1/nurses';

  constructor(private http: HttpClient) { }

  index(hospital_id: number): Observable<any> {
    let params = new HttpParams().set('hospital_id', hospital_id.toString());
    return this.http.get(`${this.apiUrl}`, { params });
  }

  show(id: number, hospital_id: number): Observable<any> {
    let params = new HttpParams().set('hospital_id', hospital_id.toString());
    return this.http.get(`${this.apiUrl}/${id}`, { params });
  }
}