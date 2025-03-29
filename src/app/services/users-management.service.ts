import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersManagementService {

  private apiUrl = 'http://34.215.209.108/api/v1/users'; 

  constructor(private http: HttpClient) { }

  getUsers(page: number = 1, perPage: number = 9): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&per_page=${perPage}`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateUserRole(userId: number, role: string, hospitalId?: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/role-management`, {
      user: userId,
      role: role,
      hospital_id: hospitalId
    });
  }}
