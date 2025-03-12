import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms'
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InputComponent } from '../shared/input/input.component';
import { CardComponent } from "../shared/card/card.component";
import { TitleComponent } from '../shared/title/title.component';
import { ButtonComponent } from '../shared/button/button.component';
import { LogoComponent } from '../shared/logo/logo.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
  standalone: true
})

export class LoginComponent {
  errorMessage: string | null = null;
  fieldErrors: { [key: string]: string } = {};
  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) { }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  form = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.email,
        Validators.required
      ]
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8)
      ]
    }),
    rememberMe: new FormControl('',)
  })

  get email() {
    return this.form.get('email')
  }

  get password() {
    return this.form.get('password')
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log("Form invalido")
    }

    const formData = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
    }

    const rememberMe = this.form.controls.rememberMe.value

    this.authService.login(formData).subscribe({
      next: (response) => {
        if (rememberMe) {
          window.localStorage.setItem(
            'token',
            response.token
          )
        } else {
          window.sessionStorage.setItem(
            'token',
            response.token
          )
        }
        this.router.navigate(['/dashboard'])
        this.form.reset()
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            this.showAlert('error', 'Error', 'Error de conexion al servidor');
          }
        } else {
          this.handleLoginError(error.error);
          this.showAlert('error', 'Error', error.error);
        }
      }
    })
  }
  handleLoginError(error: any) {
    this.errorMessage = null;
    this.fieldErrors = {};

    if (error.message) {
      this.errorMessage = error.message;
    }

    if (error.errors) {
      for (const key in error.errors) {
        if (error.errors.hasOwnProperty(key)) {
          this.fieldErrors[key] = error.errors[key];
        }
      }
    }
  }
}
