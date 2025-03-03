import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://34.215.209.108/api/v1'

  constructor(private http: HttpClient) {}

  registerUser(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(`${this.apiUrl}/sessions/register`, data)
  }

  loginUser(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(`${this.apiUrl}/sessions/login/web`, data)
  }

  userRole() {
    return this.http.get(`${this.apiUrl}/sessions/role`)
  }
}
