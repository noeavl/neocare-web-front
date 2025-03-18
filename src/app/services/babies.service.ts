import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BabiesService {
  private apiUrl = 'http://34.215.209.108/api/v1';

  constructor(private http: HttpClient) { }

  index(page: number = 1, filtros: any): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
  
    Object.keys(filtros).forEach(key => {
      if (filtros[key] !== undefined && filtros[key] !== null) {
        params = params.set(key, filtros[key]);
      }
    });
  
  
    return this.http.get(`${this.apiUrl}/babies`, { params });
  }

  show(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/babies/` + id)
  }
  
  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/babies`, data)
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/babies/` + id, data)
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/babies/` + id)
  }
}
