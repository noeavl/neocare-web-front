import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersManagementService } from '../../../../services/users-management.service';
import { HospitalService } from '../../../../services/hospital.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { SectionHeaderComponent } from "../../section-header/section-header.component";
import { CardComponent } from "../../../shared/card/card.component";
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { SelectComponent } from "../../../shared/select/select.component";
import { ButtonComponent } from "../../../shared/button/button.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Pipe, PipeTransform } from '@angular/core';

interface Hospital {
  id: number;
  name: string;
}

interface RoleOption {
  value: string;
  label: string;
}

@Pipe({ name: 'mapToSelectOptions' })
export class MapToSelectOptionsPipe implements PipeTransform {
  transform(items: any[]): { value: string; label: string }[] {
    return items?.map(item => ({
      value: item.id.toString(),
      label: item.name
    })) || [];
  }
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [MessageService],
  standalone: true,
  imports: [
    SectionHeaderComponent,
    CardComponent,
    ReactiveFormsModule,
    ToastModule,
    CommonModule,
    SelectComponent,
    ButtonComponent,
    MatProgressSpinnerModule,
    MapToSelectOptionsPipe
  ]
})
export class UserEditComponent implements OnInit {
  userId: number;
  hospitals: Hospital[] = [];
  currentHospitalId: number | null = null;
  showHospitalField = false;
  isLoading = false;
  currentRole = '';
  availableRoles: RoleOption[] = [];
  isAdminUser: boolean = false;
  fieldErrors: { [key: string]: string } = {};

  roleForm = new FormGroup({
    role: new FormControl('', [Validators.required]),
    hospital_id: new FormControl<number | null>(null)
  });

  constructor(
    private usersService: UsersManagementService,
    private hospitalService: HospitalService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.userId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.checkCurrentUserRole();
    this.loadHospitals();
    this.loadUserCurrentRole();
  }

  checkCurrentUserRole(): void {
    this.authService.userRole().subscribe({
      next: (response: any) => {
        this.isAdminUser = response.role === 'admin';
        this.setAvailableRoles();
      },
      error: () => {
        this.showError('Failed to verify user permissions');
      }
    });
  }

  setAvailableRoles(): void {
    if (this.isAdminUser) {
      this.availableRoles = [
        { value: 'nurse', label: 'Nurse' },
        { value: 'nurse-admin', label: 'Nurse Admin' }
      ];
    } else {
      this.availableRoles = [
        { value: 'super-admin', label: 'Super Admin' },
        { value: 'nurse-admin', label: 'Nurse Admin' },
        { value: 'nurse', label: 'Nurse' },
        { value: 'admin', label: 'Admin' }
      ];
    }
  }

  loadHospitals(): void {
    this.hospitalService.indexNoPaginate().subscribe({
      next: (response: any) => {
        this.hospitals = response.hospitals || [];
        this.sortHospitals();
      },
      error: () => this.showError('Failed to load hospitals list')
    });
  }

  loadUserCurrentRole(): void {
    this.usersService.getUserById(this.userId).subscribe({
      next: (user: any) => {
        this.currentRole = user.role;
        this.currentHospitalId = user.hospital_id || null;
        this.roleForm.patchValue({
          role: user.role,
          hospital_id: user.hospital_id || null
        });
        this.updateHospitalFieldVisibility(user.role);
        this.sortHospitals();
      },
      error: () => this.showError('Failed to load user data')
    });
  }

  sortHospitals(): void {
    if (!this.currentHospitalId || this.hospitals.length === 0) return;
    
    this.hospitals.sort((a, b) => {
      if (a.id === this.currentHospitalId) return -1;
      if (b.id === this.currentHospitalId) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  updateHospitalFieldVisibility(role: string): void {
    this.showHospitalField = ['nurse', 'nurse-admin'].includes(role);
    
    const hospitalControl = this.roleForm.get('hospital_id');
    if (this.showHospitalField) {
      hospitalControl?.setValidators([Validators.required]);
    } else {
      hospitalControl?.clearValidators();
      hospitalControl?.reset();
    }
    hospitalControl?.updateValueAndValidity();
  }

  handleRoleSelection(value: string): void {
    this.roleForm.controls['role'].setValue(value);
    this.updateHospitalFieldVisibility(value);
  }

  handleHospitalSelection(value: string): void {
    this.roleForm.controls['hospital_id'].setValue(Number(value)); 
  }

  onSubmit(): void {
    if (this.roleForm.invalid || this.isLoading) return;
  
    this.isLoading = true;
    const { role, hospital_id } = this.roleForm.value;

    this.usersService.updateUserRole(
      this.userId, 
      role!, 
      this.showHospitalField ? hospital_id ?? undefined : undefined
    ).subscribe({
      next: () => {
        this.showSuccess('User role updated successfully');
        this.router.navigate(['/dashboard/users', this.userId]);
      },
      error: (error) => {
        this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  private showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000
    });
  }

  private showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000
    });
  }

  private handleError(error: any): void {
    this.fieldErrors = {};
    if (error.error) {
      for (const key in error.error) {
        if (error.error.hasOwnProperty(key)) {
          this.fieldErrors[key] = error.error[key];
        }
      }
    }
    const errorMessage = error.error?.message || 'An unexpected error occurred';
    this.showError(errorMessage);
  }
}