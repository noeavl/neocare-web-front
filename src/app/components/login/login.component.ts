import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms'
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  constructor(private authService: AuthService) {} 

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
    rememberMe: new FormControl('', )
  })

  onSubmit() {
    if (this.form.invalid) {
      console.log("Form invalido")
    }

    const formData = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
    }

    const rememberMe =  this.form.controls.rememberMe.value

    this.authService.loginUser(formData).subscribe(
      (response) => {
        console.log(response)
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
        this.form.reset()
      },
      (error) => {
        console.error(error);
      }
    )
  }
}
