import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://34.215.209.108/api/v1/profile';

  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }
}