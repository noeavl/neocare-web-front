import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

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

  ngOnInit() {
    this.checkAuthentication()
  }

  checkAuthentication() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    this.isAuthenticated = !!token
  }
}
