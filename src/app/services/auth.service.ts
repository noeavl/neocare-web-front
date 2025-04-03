import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, BehaviorSubject } from 'rxjs'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://34.215.209.108/api/v1'
  private router = inject(Router)
  private authStatus = new BehaviorSubject<{isAuthenticated: boolean, role: string}>({
    isAuthenticated: this.isAuthenticated(),
    role: ''
  })

  authStatus$ = this.authStatus.asObservable()

  constructor(private http: HttpClient) { 
    this.updateAuthStatus()
  }

  registerUser(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(`${this.apiUrl}/sessions/register-web`, data)
  }

  login(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(`${this.apiUrl}/sessions/login`, data).pipe(
      tap(() => {
        this.updateAuthStatus()
      })
    )
  }

  userRole(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sessions/role`).pipe(
      tap((response: any) => {
        this.authStatus.next({
          isAuthenticated: true,
          role: response.role
        })
      })
    )
  }

  logout(): Observable<any> {
    const logout$ = this.http.get(`${this.apiUrl}/sessions/logout`).pipe(
      tap(() => {
        this.clearAuthData()
      })
    )
    
    this.clearAuthData()
    return logout$
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    return !!token
  }

  updateAuthStatus(): void {
    if (this.isAuthenticated()) {
      this.userRole().subscribe({
        error: () => {
          this.authStatus.next({
            isAuthenticated: false,
            role: ''
          })
        }
      })
    } else {
      this.authStatus.next({
        isAuthenticated: false,
        role: ''
      })
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    this.authStatus.next({
      isAuthenticated: false,
      role: ''
    })
    this.router.navigate(['log-in'])
  }

  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sessions/resend-activation`, { email })
  }
}