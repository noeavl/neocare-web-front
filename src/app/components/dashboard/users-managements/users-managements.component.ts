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
  totalItems = 0;
  pageSize = 9;
  currentPage = 0;
  dataLoaded = false;
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
        console.error('Error al obtener el rol del usuario:', error);
        this.loadUsers(); 
      }
    });
  }


  loadUsers(): void {
    this.dataLoaded = false;
    this.usersService.getUsers(this.currentPage + 1, this.pageSize).subscribe({
      next: (response: any) => {
        this.users = response.data || [];
        this.totalItems = response.total || 0;
        this.pageSize = response.per_page || this.pageSize;
        this.currentPage = response.current_page - 1;
        this.dataLoaded = true;
      },
      error: (error) => {
        this.showAlert('error', 'Error', 'Could not load users');
        this.dataLoaded = true;
      }
    });
  }

  updateUserRole(user: any, role: string, hospitalId?: number): void {
    this.dataLoaded = false;
    this.usersService.updateUserRole(user.id, role, hospitalId).subscribe({
      next: () => {
        this.showAlert('success', 'Success', 'Role updated successfully');
        user.role = role;
        this.dataLoaded = true;
      },
      error: (error) => {
        this.showAlert('error', 'Error', error.error?.message || 'Failed to update role');
        this.dataLoaded = true;
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