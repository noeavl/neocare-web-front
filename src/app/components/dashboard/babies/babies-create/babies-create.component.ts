import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { CardComponent } from '../../../shared/card/card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../shared/input/input.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { SelectComponent } from '../../../shared/select/select.component';
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { BabiesService } from '../../../../services/babies.service';
import { MessageService } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HospitalService } from '../../../../services/hospital.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';




@Component({
  selector: 'app-babies-create',
  imports: [SectionHeaderComponent, CardComponent, ReactiveFormsModule, CommonModule, InputComponent, ButtonComponent,
     SelectComponent, ToastModule, MatProgressSpinner, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './babies-create.component.html',
  styleUrl: './babies-create.component.css',
  providers: [MessageService]
})
export class BabiesCreateComponent {
  hospitals: any[] = []
  dataLoad = false
  errorMessage: string | null = null;
  fieldErrors: { [key: string]: string } = {}
  maxDate: string;


  constructor(private babiesService: BabiesService, private messageService: MessageService, private hospitalsService: HospitalService) {
    this.maxDate = this.getTodayDate();
   }

   getTodayDate(): string {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    last_name_1: new FormControl('', [Validators.required]),
    last_name_2: new FormControl('', [Validators.required]),
    birth_date: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
    ]),
    hospital_id: new FormControl('', [Validators.required])
  })

  get name() {
    return this.form.get('name')
  }

  get last_name_1(){
    return this.form.get('last_name_1')
  }

  get last_name_2(){
    return this.form.get('last_name_2')
  }

  get birth_date(){
    return this.form.get('birth_date')
  }

  get hospital_id(){
    return this.form.get('hospital_id')
  }
  
  ngOnInit(){
    this.loadHospitals()
  }

  formatDate(date: string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return null; 
    }
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }


  loadHospitals() {
    this.hospitalsService.indexNoPaginate().subscribe({
      next: (response) => {
        this.hospitals = response.hospitals.map((hospital: any) => ({
          value: hospital.id.toString(),
          label: hospital.name,
        }))
        this.dataLoad = true
      },
      error: (error) => {
        console.log(error)
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

  sumbit() {
    if (this.form.valid) {
      const formData = {
        name: this.form.controls['name'].value,
        last_name_1: this.form.controls['last_name_1'].value,
        last_name_2: this.form.controls['last_name_2'].value,
        date_of_birth: this.form.controls['birth_date'].value,
        hospital_id: this.form.controls['hospital_id'].value
      }
      
      this.babiesService.create(formData).subscribe({
        next: (response) => {
          this.showAlert('success', 'Success', response.message)
          this.form.reset()
          this.form.controls['hospital_id'].setValue('');
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 0) {
              this.showAlert('error', 'Error', 'Fail to connect to the server')
            }
          }
          if (error.error) {
            this.handleError(error.error)
            this.showAlert('error', 'Error', 'Please check the form')
          }
        }
      })
    }
  }

  handleSelection(value: string): void {
    this.form.controls['hospital_id'].setValue(value)
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
