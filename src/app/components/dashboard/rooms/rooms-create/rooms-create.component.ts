import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { CardComponent } from '../../../shared/card/card.component';
import { HospitalService } from '../../../../services/hospital.service';
import { MessageService } from 'primeng/api';
import { RoomsService } from '../../../../services/rooms.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectComponent } from '../../../shared/select/select.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputComponent } from '../../../shared/input/input.component';
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
InputComponent
@Component({
  selector: 'app-rooms-create',
  imports: [SectionHeaderComponent, CardComponent, CardComponent, ReactiveFormsModule, SelectComponent, ButtonComponent, InputComponent, ToastModule, MatProgressSpinnerModule],
  templateUrl: './rooms-create.component.html',
  styleUrl: './rooms-create.component.css',
  providers: [MessageService]
})
export class RoomsCreateComponent {

  hospitals: any[] = []
  dataLoad = false
  errorMessage: string | null = null;
  fieldErrors: { [key: string]: string } = {};
  constructor(private hospitalService: HospitalService, private roomsService: RoomsService, private messageService: MessageService) { }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    number: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    hospital_id: new FormControl('', [Validators.required])
  })

  get name() {
    return this.form.get('name')
  }
  get number() {
    return this.form.get('number')
  }

  get hospital_id() {
    return this.form.get('hospital_id')
  }

  ngOnInit() {
    this.getHospitals()
  }

  sumbit() {
    if (this.form.valid) {
      const formData = {
        name: this.form.controls['name'].value,
        number: this.form.controls['number'].value,
        hospital_id: this.form.controls['hospital_id'].value
      }

      this.roomsService.create(formData).subscribe({
        next: (response) => {
          this.form.reset()
          this.showAlert('success', 'Success', response.message)
          this.fieldErrors = {};
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 0) {
              this.showAlert('error', 'Error', 'Fail to connect to the server');
            } else if (error.status === 404) {
              this.showAlert('error', 'Error', '404 Not found');
            } else if (error.status === 422) {
              this.handleError(error.error.errors);
              this.showAlert('warn', 'Error', 'Please check the form');
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
  handleSelection(value: string): void {
    this.form.controls['hospital_id'].setValue(value)
  }
  getHospitals() {
    this.hospitalService.indexNoPaginate().subscribe({
      next: (response) => {
        this.hospitals = response.hospitals.map((hospital: any) => ({
          value: hospital.id.toString(),
          label: hospital.name
        }))
        this.dataLoad = true
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
