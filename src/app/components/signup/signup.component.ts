import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../shared/input/input.component';
import { ButtonComponent } from '../shared/button/button.component';
import { CardComponent } from "../shared/card/card.component";
import { ToastModule } from 'primeng/toast';
import { TitleComponent } from '../shared/title/title.component';
import { LogoComponent } from '../shared/logo/logo.component';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

export function passwordMatchValidator(): ValidatorFn {
  return (control) => {
    const password = control.get('password');
    const password_confirmation = control.get('password_confirmation');
    if (password?.value !== password_confirmation?.value) {
      return { passwordMismatch: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    TitleComponent,
    CardComponent,
    ButtonComponent,
    LogoComponent,
    ToastModule,
    CommonModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  providers: [MessageService]
})
export class SignupComponent {

  fieldErrors: { [key: string]: string } = {};
  constructor(private authService: AuthService, private messageService: MessageService) { }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]),
    firstLastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]),
    secondLastName: new FormControl('', [Validators.minLength(3), Validators.maxLength(64)]),
    userName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password_confirmation: new FormControl('', [Validators.required])
  }, { validators: passwordMatchValidator() });

  get name() { return this.form.get('name'); }
  get firstLastName() { return this.form.get('firstLastName'); }
  get secondLastName() { return this.form.get('secondLastName'); }
  get userName() { return this.form.get('userName'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get password_confirmation() { return this.form.get('password_confirmation'); }

  onSubmit() {
    if (this.form.valid) {
      const formData = {
        name: this.form.controls.name.value,
        last_name_1: this.form.controls.firstLastName.value,
        last_name_2: this.form.controls.secondLastName.value,
        username: this.form.controls.userName.value,
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
        password_confirmation: this.form.controls.password_confirmation.value
      };
      this.authService.registerUser(formData).subscribe({
        next: (response) => {
          this.showAlert('success', 'Success', response.message);
          this.form.reset();
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 0) {
              this.showAlert('error', 'Error', 'Fail to connect to the server');
            } else if (error.status === 404) {
              this.showAlert('error', 'Error', '404 Not found');
            } else if (error.status === 422) {
              this.handleError(error.error);
              this.showAlert('error', 'Error', 'Please check the form');
            } else if (error.status === 401) {
              this.showAlert('error', 'Error', error.error.message);
            } else {
              this.showAlert('error', 'Error', error.error.message);
            }
          }
        }
      });
    }
  }

  handleError(error: any) {
    this.fieldErrors = {};
    if (error) {
      for (const key in error) {
        if (error.hasOwnProperty(key)) {
          this.fieldErrors[key] = error[key];
        }
      }
    }
  }
}
