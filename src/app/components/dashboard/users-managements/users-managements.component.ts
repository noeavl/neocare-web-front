import { Component, OnInit } from '@angular/core';
import { UsersManagementService } from '../../../services/users-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-users-managements',
  standalone: true, // ← Asegúrate de que esto está true
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './users-managements.component.html',
  styleUrl: './users-managements.component.css'
})
export class UsersManagementsComponent implements OnInit{

  users: any[] = [];
  totalItems = 0;
  pageSize = 9;
  currentPage = 0;
  isLoading = false;

  constructor(
    private usersService: UsersManagementService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 1): void {
    this.isLoading = true;
    this.usersService.getUsers(page, this.pageSize).subscribe({
      next: (response: any) => {
        this.users = response.data;
        this.totalItems = response.total;
        this.currentPage = response.current_page - 1;
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Error al cargar usuarios');
        this.isLoading = false;
      }
    });
  }

  openRoleDialog(user: any): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUserRole(user, result.role, result.hospitalId);
      }
    });
  }

  updateUserRole(user: any, role: string, hospitalId?: number): void {
    this.isLoading = true;
    this.usersService.updateUserRole(user.id, role, hospitalId).subscribe({
      next: () => {
        this.showSuccess('Rol actualizado correctamente');
        user.role = role;
        this.isLoading = false;
      },
      error: (error) => {
        this.showError(error.error?.message || 'Error al actualizar rol');
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.loadUsers(event.pageIndex + 1);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
