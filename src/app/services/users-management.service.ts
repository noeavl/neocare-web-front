import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersManagementService {
  private apiUrl = 'http://34.215.209.108/api/v1/users'; 

  constructor(private http: HttpClient) { }

  // Obtener lista paginada de usuarios
  getUsers(page: number = 1, perPage: number = 9): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&per_page=${perPage}`);
  }

  // Obtener un usuario específico por ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // En tu servicio
  updateUser(userId: number, data: { name: string; email: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, data);
  }

  updateUserRole(userId: number, role: string, hospitalId?: number): Observable<any> {
    const payload: any = {
      user: userId,
      role: role
    };

    if (hospitalId) {
      payload.hospital_id = hospitalId;
    }

    return this.http.put(`${this.apiUrl}/role-management`, payload);
  }
  
  // Crear un nuevo usuario (para el formulario de creación)
  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  // Eliminar usuario
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  // Buscar usuarios (para futuras implementaciones de búsqueda)
  searchUsers(query: string, page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?q=${query}&page=${page}`);
  }
}