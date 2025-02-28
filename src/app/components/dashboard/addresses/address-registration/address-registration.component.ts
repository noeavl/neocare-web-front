import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../../../services/address.service';
import { SectionHeaderComponent } from "../../section-header/section-header.component";

@Component({
  selector: 'app-address-registration',
  imports: [
    ReactiveFormsModule,
    SectionHeaderComponent
],
  templateUrl: './address-registration.component.html',
  styleUrl: './address-registration.component.css'
})
export class AddressRegistrationComponent {
  constructor(private addressService: AddressService) {}

  form = new FormGroup({
    state: new FormControl('', [
      Validators.required 
    ]),
    city: new FormControl('',[
      Validators.required
    ]),
    neighborhood: new FormControl('', [
      Validators.required
    ]),
    street: new FormControl('', [
      Validators.required
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

  onSubmit() {
    console.log(this.form)

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
        console.log("address added")
        this.form.reset()
      },
      (error) => {
        console.log(error)
      }
    )
  }
}
