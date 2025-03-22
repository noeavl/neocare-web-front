import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RelativesService {
     private apiUrl = 'http://34.215.209.108/api/v1'

     constructor(private http: HttpClient) { }

     indexWithRelatives(page: number = 1, id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/relativesWithBaby/` + id + `?page=${page}`)
      }

      delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/relatives/${id}`)
      }
}