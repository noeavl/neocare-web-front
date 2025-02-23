import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../../../services/address.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-address-edition',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './address-edition.component.html',
  styleUrl: './address-edition.component.css'
})
export class AddressEditionComponent implements OnInit {
  constructor(
    private addressService: AddressService,
    private route: ActivatedRoute
  ) {}

  form = new FormGroup({
    state: new FormControl(''),
    city: new FormControl(''),
    neighborhood: new FormControl(''),
    street: new FormControl(''),
    number: new FormControl('', [
      Validators.pattern('^[0-9]*$')
    ]),
    zipCode: new FormControl('', [
      Validators.minLength(5),
      Validators.maxLength(5),
      Validators.pattern('^[0-9]*$')
    ])
  });

  id!: number;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
    });

    console.log(this.id);
  }

  onSubmit() {
    const formData = {
      state: this.form.controls.state.value ? this.form.controls.state.value : null,
      city: this.form.controls.city.value ? this.form.controls.city.value : null,
      neighborhood: this.form.controls.neighborhood.value ? this.form.controls.neighborhood.value : null,
      street: this.form.controls.street.value ? this.form.controls.street.value : null,
      number: this.form.controls.number.value ? this.form.controls.number.value : null,
      zip_code: this.form.controls.zipCode.value ? this.form.controls.zipCode.value : null
    };

    this.addressService.updateAddress(this.id, formData).subscribe(
      (response) => {
        console.log("address edited");
        this.form.reset();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}