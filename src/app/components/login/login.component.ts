import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms'
import { RouterLink } from '@angular/router';

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
    console.log(this.form)
  }
}
