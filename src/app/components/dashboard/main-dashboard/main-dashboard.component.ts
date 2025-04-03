import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/card/card.component";
import { IconComponent } from '../../shared/icon/icon.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [
    CardComponent,
    IconComponent,
    RouterLink
  ],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent implements OnInit {
  role: string = '';
  filteredDirectAccesses: any[] = [];

  // Todos los accesos posibles
  allDirectAccesses = [
    {
      img: '/recursos-web/address.png',
      title: 'Addresses',
      route: '/dashboard/addresses/list',
      roles: ['admin', 'super-admin'] // Solo para admins
    },
    {
      img: '/recursos-web/users-icon.png',
      title: 'Users',
      route: '/dashboard/users',
      roles: ['admin', 'super-admin'] // Solo para admins
    },
    {
      img: '/recursos-web/checks-icon.png',
      title: 'Checks',
      route: '/dashboard/checks/list',
      roles: ['admin', 'super-admin', 'nurse', 'nurse-admin'] // Para todos
    },
    // Puedes agregar más accesos aquí
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userRole().subscribe(
      (response) => {
        this.role = response.role;
        this.filterAccesses(); // Filtra los accesos cuando se obtiene el rol
      },
      (error) => {
      }
    );
  }

  // Filtra los accesos según el rol del usuario
  filterAccesses(): void {
    this.filteredDirectAccesses = this.allDirectAccesses.filter(access => 
      access.roles.includes(this.role)
    );
  }
}