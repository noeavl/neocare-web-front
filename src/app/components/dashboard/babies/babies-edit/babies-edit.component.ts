import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { CardComponent } from '../../../shared/card/card.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../shared/input/input.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { SelectComponent } from '../../../shared/select/select.component';
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MessageService } from 'primeng/api';
import { HospitalService } from '../../../../services/hospital.service';
import { BabiesService } from '../../../../services/babies.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-babies-edit',
  imports: [SectionHeaderComponent,
    CardComponent,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent,
    ToastModule,
    MatProgressSpinner,
    RouterModule
  ],
  templateUrl: './babies-edit.component.html',
  styleUrl: './babies-edit.component.css',
  providers: [MessageService]
})
export class BabiesEditComponent {
  id: number
  hospitals: any[] = []
  dataLoad = false
  errorMessage: string | null = null;
  fieldErrors: { [key: string]: string } = {};
  maxDate: string;

  constructor(private hospitalService: HospitalService, private babiesService: BabiesService, private messageService: MessageService, private route: ActivatedRoute, private router: Router) {
    this.id = this.route.snapshot.params['id'];
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

  get last_name_1() {
    return this.form.get('last_name_1')
  }

  get last_name_2() {
    return this.form.get('last_name_2')
  }

  get birth_date() {
    return this.form.get('birth_date')
  }

  get hospital_id() {
    return this.form.get('hospital_id')
  }

  ngOnInit() {
    this.loadHospitals()
    this.getBaby()
  }

  formatDate(date: string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return null; 
    }
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }
  
  handleSelection(value: string): void {
    this.form.controls['hospital_id'].setValue(value)
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
      debugger;
      this.babiesService.update(this.id, formData).subscribe({
        next: (response) => {
          this.showAlert('success', 'Success', response.message)
          // this.router.navigate(['/dashboard/babies/list'])
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

  loadHospitals() {
    this.hospitalService.indexNoPaginate().subscribe({
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
  
  getBaby() {
    this.babiesService.show(this.id).subscribe({
      next: (response) => {
        this.form.controls['name'].setValue(response.baby.person.name)
        this.form.controls['last_name_1'].setValue(response.baby.person.last_name_1)
        this.form.controls['last_name_2'].setValue(response.baby.person.last_name_2)
        this.form.controls['birth_date'].setValue(response.baby.date_of_birth)
        this.form.controls['hospital_id'].setValue(response.baby.hospital_id)
      },
      error: (error) => {
        console.log(error)
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            this.showAlert('error', 'Error', 'Fail to connect to the server');
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
