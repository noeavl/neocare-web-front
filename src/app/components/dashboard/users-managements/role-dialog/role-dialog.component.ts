import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.css']
})
export class RoleDialogComponent {
  roleForm: FormGroup;
  availableRoles = ['super-admin', 'nurse-admin', 'nurse', 'user'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roleForm = this.fb.group({
      role: [data.user.role, Validators.required],
      hospitalId: [null]
    });

    this.setupRoleChangeListener();
  }

  private setupRoleChangeListener(): void {
    this.roleForm.get('role')?.valueChanges.subscribe(role => {
      const hospitalIdControl = this.roleForm.get('hospitalId');
      
      if (role === 'nurse') {
        hospitalIdControl?.setValidators([Validators.required]);
      } else {
        hospitalIdControl?.clearValidators();
        hospitalIdControl?.reset();
        hospitalIdControl?.setErrors(null); // Limpia errores existentes
      }
      hospitalIdControl?.updateValueAndValidity();
    });
  }

  requiresHospitalId(): boolean {
    return this.roleForm.get('role')?.value === 'nurse';
  }

  isFormValid(): boolean {
    const role = this.roleForm.get('role')?.value;
    const hospitalId = this.roleForm.get('hospitalId')?.value;
    
    // El formulario es válido si:
    // 1. Tiene un rol seleccionado
    // 2. Si es nurse, tiene hospitalId, para otros roles no importa
    return this.roleForm.get('role')?.valid && 
           (role !== 'nurse' || (role === 'nurse' && hospitalId));
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      const result = {
        role: this.roleForm.value.role,
        hospitalId: this.requiresHospitalId() ? this.roleForm.value.hospitalId : null
      };
      this.dialogRef.close(result);
    }
  }
}