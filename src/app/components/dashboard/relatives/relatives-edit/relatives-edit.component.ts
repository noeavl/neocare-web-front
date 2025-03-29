import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { CardComponent } from '../../../shared/card/card.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../shared/input/input.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MessageService } from 'primeng/api';
import { RelativesService } from '../../../../services/relatives.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-relatives-edit',
  imports: [
    SectionHeaderComponent,
    CardComponent,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent,
    ToastModule,
    MatProgressSpinner,
    RouterModule
  ],
  templateUrl: './relatives-edit.component.html',
  styleUrl: './relatives-edit.component.css',
  providers: [MessageService]
})
export class RelativesEditComponent {
  id: number;
  dataLoad = false;
  errorMessage: string | null = null;
  fieldErrors: { [key: string]: string } = {};
  babyId: number;

  constructor(
    private relativesService: RelativesService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.babyId = 0;
    this.id = this.route.snapshot.params['id'];
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
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

  ngOnInit() {
    this.getRelative();
  }

  submit() {
    if (this.form.valid) {
      const formData = {
        name: this.form.controls['name'].value,
        last_name_1: this.form.controls['last_name_1'].value,
        last_name_2: this.form.controls['last_name_2'].value,
        phone_number: this.form.controls['phone_number'].value,
        email: this.form.controls['email'].value
      };
      this.relativesService.update(this.id, formData).subscribe({
        next: (response) => {
          this.showAlert('success', 'Success', response.message);
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

  getRelative() {
    this.relativesService.show(this.id).subscribe({
      next: (response) => {
        this.form.controls['name'].setValue(response.relative.person.name);
        this.form.controls['last_name_1'].setValue(response.relative.person.last_name_1);
        this.form.controls['last_name_2'].setValue(response.relative.person.last_name_2);
        this.form.controls['phone_number'].setValue(response.relative.phone_number);
        this.form.controls['email'].setValue(response.relative.email);
        this.babyId = response.relative.baby_id;
        this.dataLoad = true;
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            this.showAlert('error', 'Error', 'Fail to connect to the server');
          }
        }
      }
    });
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
