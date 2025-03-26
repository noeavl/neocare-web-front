import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isAuthenticated: boolean = false;
  rol!: string

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.checkAuthentication()
    this.checkRol()
  }

  checkAuthentication() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    this.isAuthenticated = !!token
  }

  checkRol() {
    if (this.isAuthenticated) {
      this.authService.userRole().subscribe(
        (response) => {
          this.rol = response.role
        },
        (error) => {
          
        }
      )
    }
  }
}
