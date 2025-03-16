import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../shared/input/input.component';
import { ButtonComponent } from '../shared/button/button.component';
import { CardComponent } from "../shared/card/card.component";
import { ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    CardComponent
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  passwordsMatch = true;

  constructor(private authService: AuthService) { }

  form = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(64)
    ]),
    firstLastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(64)
    ]),
    secondLastName: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(64)
    ]),
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(64)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ])
  });

  ngOnInit() {
    this.form.get('password')?.valueChanges.subscribe(() => this.checkPasswords());
    this.form.get('confirmPassword')?.valueChanges.subscribe(() => this.checkPasswords());
  }

  checkPasswords() {
    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;
    this.passwordsMatch = password === confirmPassword;
  }

  onSubmit() {
    if (this.form.invalid || !this.passwordsMatch) {
      console.log("Formulario inválido");
      return;
    }

    const formData = {
      name: this.form.controls.firstName.value,
      last_name_1: this.form.controls.firstLastName.value,
      last_name_2: this.form.controls.secondLastName.value,
      username: this.form.controls.userName.value,
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      password_confirmation: this.form.controls.confirmPassword.value
    };

    this.authService.registerUser(formData).subscribe(
      (response) => {
        console.log("Usuario registrado con éxito:", response);
        this.form.reset();
      },
      (error) => {
        console.error("Error en el registro:", error);
      }
    );
  }
}
