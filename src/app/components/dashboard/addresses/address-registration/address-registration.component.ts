import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../../../services/address.service';
import { SectionHeaderComponent } from "../../section-header/section-header.component";
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-address-registration',
  imports: [
    ReactiveFormsModule,
    SectionHeaderComponent,
    ToastModule, 
    ButtonModule,
    RippleModule
],
  templateUrl: './address-registration.component.html',
  styleUrl: './address-registration.component.css',
  providers: [
    MessageService
  ]
})
export class AddressRegistrationComponent {
  constructor(
    private addressService: AddressService,
    private messageService: MessageService
  ) {}

  form = new FormGroup({
    state: new FormControl('', [
      Validators.required,
      Validators.maxLength(50)
    ]),
    city: new FormControl('',[
      Validators.required,
      Validators.maxLength(50)
    ]),
    neighborhood: new FormControl('', [
      Validators.required,
      Validators.maxLength(50)
    ]),
    street: new FormControl('', [
      Validators.required,
      Validators.maxLength(50)
    ]),
    number: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.min(1)
    ]),
    zipCode: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(5),
      Validators.pattern('^[0-9]*$')
    ])
  })

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  onSubmit() {
    const formData = {
      state: this.form.controls.state.value,
      city: this.form.controls.city.value,
      neighborhood: this.form.controls.neighborhood.value,
      street: this.form.controls.street.value,
      number: this.form.controls.number.value,
      zip_code: this.form.controls.zipCode.value
    }

    this.addressService.createAddress(formData).subscribe(
      (response) => {
        this.showAlert('success', 'Address added', response.msg);
        this.form.reset()
      },
      (error) => {
        Object.values(error.error.errors).forEach((messages) => {
          this.showAlert('error', 'Error', messages as string)
        })
        
        this.showAlert('error', 'Error', 'Por favor, revisa los datos ingresados.')
      }
    )
  }
}
