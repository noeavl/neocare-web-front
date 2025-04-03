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
  selector: 'app-resend-verification',
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
  templateUrl: './resend-verification.component.html',
  styleUrl: './resend-verification.component.css',
  providers: [MessageService]
})

export class ResendVerificationComponent {
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
    })
  })

  get email() {
    return this.form.get('email')
  }


  onSubmit() {
    if (this.form.valid) {
      const formData = {
        email: this.form.controls.email.value,
      }

      this.authService.resendVerificationEmail(formData.email!).subscribe({
        next: (response) => {
          console.log(response)
          this.showAlert('success', 'Success', response.message);
          this.form.reset()
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
      })
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
