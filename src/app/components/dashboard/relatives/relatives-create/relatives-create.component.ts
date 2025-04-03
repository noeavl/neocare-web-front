import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { CardComponent } from '../../../shared/card/card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../shared/input/input.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RelativesService } from '../../../../services/relatives.service';
import { MessageService } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-relatives-create',
  imports: [
    SectionHeaderComponent, 
    CardComponent, 
    ReactiveFormsModule, 
    CommonModule, 
    InputComponent, 
    ButtonComponent,
    ToastModule,
    MatInputModule
  ],
  templateUrl: './relatives-create.component.html',
  styleUrl: './relatives-create.component.css',
  providers: [MessageService]
})
export class RelativesCreateComponent {
  id: number;
  errorMessage: string | null = null;
  fieldErrors: { [key: string]: string } = {};

  constructor(private relativesService: RelativesService, private messageService: MessageService, private route: ActivatedRoute) {
    this.id = Number(this.route.snapshot.params['id']);
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, key: 'br', life: 3000 });
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    last_name_1: new FormControl('', [Validators.required]),
    last_name_2: new FormControl('', [Validators.required]),
    phone_number: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  get name() {
    return this.form.get('name');
  }

  get last_name_1() {
    return this.form.get('last_name_1');
  }

  get last_name_2() {
    return this.form.get('last_name_2');
  }

  get phone_number() {
    return this.form.get('phone_number');
  }

  get email() {
    return this.form.get('email');
  }

  submit() {
    if (this.form.valid) {
      const formData = {
        name: this.form.controls['name'].value,
        last_name_1: this.form.controls['last_name_1'].value,
        last_name_2: this.form.controls['last_name_2'].value,
        phone_number: this.form.controls['phone_number'].value,
        email: this.form.controls['email'].value,
        baby_id: this.id
      };

      debugger;
      
      this.relativesService.create(formData).subscribe({
        next: (response) => {
          this.showAlert('success', 'Success', response.message);
          this.form.reset();
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 0) {
              this.showAlert('error', 'Error', 'Fail to connect to the server');
            }
          }
          if (error.error) {
            this.handleError(error.error);
            this.showAlert('error', 'Error', 'Please check the form');
          }
        }
      });
    }
  }

  handleError(error: any) {
    this.errorMessage = null;
    this.fieldErrors = {};
    
    if (error.message) {
      this.errorMessage = error.message;
    }

    if (error) {
      for (const key in error) {
        if (error.hasOwnProperty(key)) {
          this.fieldErrors[key] = error[key];
        }
      } 
    }
  }
}
