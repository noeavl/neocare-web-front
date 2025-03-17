import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://34.215.209.108/api/v1'
  private router = inject(Router)

  constructor(private http: HttpClient) { }

  registerUser(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(`${this.apiUrl}/sessions/register-web`, data)
  }

  login(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(`${this.apiUrl}/sessions/login/web`, data)
  }

  userRole() {
    return this.http.get(`${this.apiUrl}/sessions/role`)
  }
  logout() {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    this.router.navigate(['log-in'])
    return this.http.get(`${this.apiUrl}/sessions/logout`)
  }
}
