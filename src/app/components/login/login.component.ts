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
    })
  })

  onSubmit() {
    if (this.form.invalid) {
      console.log("Form invalido")
    }

    const formData = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value
    }

    this.authService.loginUser(formData).subscribe(
      (response) => {
        console.log(response)
        window.localStorage.setItem(
          'token',
          JSON.stringify({
            token: response.token
          })
        )
        this.form.reset();
      },
      (error) => {
        console.error(error);
      }
    )
  }
}
