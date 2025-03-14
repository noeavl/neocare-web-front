import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { CardComponent } from '../../../shared/card/card.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HospitalService } from '../../../../services/hospital.service';
import { InputComponent } from '../../../shared/input/input.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { SelectComponent } from '../../../shared/select/select.component';
import { AddressService } from '../../../../services/address.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-hospitals-create',
  imports: [SectionHeaderComponent, CardComponent, ReactiveFormsModule, CommonModule, InputComponent, ButtonComponent, SelectComponent, ToastModule, MatProgressSpinner],
  templateUrl: './hospitals-create.component.html',
  styleUrl: './hospitals-create.component.css',
  providers: [MessageService]
})
export class HospitalsCreateComponent {
  addresses: any[] = []
  dataLoad = false
  errorMessage: string | null = null;
  fieldErrors: { [key: string]: string } = {};
  constructor(private hospitalService: HospitalService, private addressService: AddressService, private messageService: MessageService) { }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone_number: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]),
    address_id: new FormControl('', [Validators.required])
  })

  get name() {
    return this.form.get('name')
  }
  get phone_number() {
    return this.form.get('phone_number')
  }

  get address_id() {
    return this.form.get('address_id')
  }

  ngOnInit() {
    this.getAddresses()
  }

  sumbit() {
    if (this.form.valid) {
      const formData = {
        name: this.form.controls['name'].value,
        phone_number: this.form.controls['phone_number'].value,
        address_id: this.form.controls['address_id'].value
      }

      this.hospitalService.create(formData).subscribe({
        next: (response) => {
          this.showAlert('success', 'Success', response.message)
          this.form.reset()
          this.form.controls['address_id'].setValue('');
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 0) {
              this.showAlert('error', 'Error', 'Error de conexion al servidor');
            }
          }
        }
      })
    }
  }
  handleSelection(value: string): void {
    this.form.controls['address_id'].setValue(value)
  }
  getAddresses() {
    this.addressService.indexNoPaginate().subscribe({
      next: (response) => {
        this.addresses = response.addresses.map((address: any) => ({
          value: address.id.toString(),
          label: `${address.street}, ${address.city}, ${address.state}`
        }))
        this.dataLoad = true
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            this.showAlert('error', 'Error', 'Error de conexion al servidor');
          }
        } else {
          this.handleError(error.error)
          this.showAlert('error', 'Error', error.error);
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

    if (error.errors) {
      for (const key in error.errors) {
        if (error.errors.hasOwnProperty(key)) {
          this.fieldErrors[key] = error.errors[key];
        }
      }
    }
  }
}
