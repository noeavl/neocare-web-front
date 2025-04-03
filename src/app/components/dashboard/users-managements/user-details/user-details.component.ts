import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UsersManagementService } from '../../../../services/users-management.service'
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { SectionHeaderComponent } from '../../section-header/section-header.component'
import { DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { AuthService } from '../../../../services/auth.service'

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    SectionHeaderComponent,
    DatePipe,
    RouterLink
  ],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: any
  isLoading = true
  currentUserRole: string = ''

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersManagementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserRole()
    const userId = this.route.snapshot.paramMap.get('id')
    if (userId) {
      this.loadUserDetails(+userId)
    }
  }

  getCurrentUserRole(): void {
    this.authService.userRole().subscribe({
      next: (response: any) => {
        this.currentUserRole = response.role || ''
      },
      error: (error) => {
      }
    })
  }

  loadUserDetails(userId: number): void {
    this.isLoading = true
    this.usersService.getUserById(userId).subscribe({
      next: (response: any) => {
        this.user = response
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false
      }
    })
  }

  getRoleColorClass(): string {
    if (!this.user) return ''
    return `role-${this.user.role.replace('_', '-')}`
  }

  // Nuevo método para verificar si se debe mostrar el botón de edición
  shouldShowEditButton(): boolean {
    if (!this.user || !this.currentUserRole) return false
    return !(this.currentUserRole === 'admin' && this.user.role === 'super-admin')
  }
}