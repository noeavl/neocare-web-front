import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { UsersManagementService } from '../../../services/users-management.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastModule } from 'primeng/toast';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-users-managements',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginator,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ToastModule,
    NgFor,
    NgIf,
    RouterLink
    ],
  templateUrl: './users-managements.component.html',
  styleUrl: './users-managements.component.css',
  providers: [MessageService]
})
export class UsersManagementsComponent implements OnInit {
  users: any[] = [];
  dataLoad = false; 
  currentPage = 0;
  pageSize = 9;
  totalItems = 0;
  currentUserRole: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() id!: number

  constructor(
    private usersService: UsersManagementService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserRole();
    
  }

  getCurrentUserRole(): void {
    this.authService.userRole().subscribe({
      next: (response: any) => {
        this.currentUserRole = response.role || '';
        this.loadUsers();
      },
      error: (error) => {
        this.loadUsers(); 
      }
    });
  }


  loadUsers(): void {
    this.dataLoad = false;
    this.usersService.getUsers(this.currentPage + 1, this.pageSize).subscribe({
      next: (response: any) => {
        this.users = response.data || []; // Asegurar compatibilidad con estructura paginada
        this.totalItems = response.total || 0;
        this.pageSize = response.per_page || this.pageSize;
        this.currentPage = response.current_page - 1; // Ajustar índice base 0
        this.dataLoad = true;
      },
      error: (error) => {
        this.showAlert('error', 'Error', 'Could not load users');
        this.dataLoad = true;
      }
    });
  }

  updateUserRole(user: any, role: string, hospitalId?: number): void {
    this.dataLoad = false;
    this.usersService.updateUserRole(user.id, role, hospitalId).subscribe({
      next: () => {
        this.showAlert('success', 'Success', 'Role updated successfully');
        user.role = role;
        this.dataLoad = true;
      },
      error: (error) => {
        this.showAlert('error', 'Error', error.error?.message || 'Failed to update role');
        this.dataLoad = true;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }
}