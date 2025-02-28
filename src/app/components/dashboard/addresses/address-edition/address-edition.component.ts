import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../../../services/address.service';
import { ActivatedRoute } from '@angular/router';
import { SectionHeaderComponent } from '../../section-header/section-header.component';

@Component({
  selector: 'app-address-edition',
  imports: [
    ReactiveFormsModule,
    SectionHeaderComponent
  ],
  templateUrl: './address-edition.component.html',
  styleUrls: ['./address-edition.component.css']
})
export class AddressEditionComponent implements OnInit {
  form!: FormGroup;
  
  constructor(
    private addressService: AddressService,
    private route: ActivatedRoute
  ) {}
  
  id!: number;
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.loadAddress(this.id);
    });

    this.form = new FormGroup({
      state: new FormControl('', [
          Validators.required
      ]),
      city: new FormControl('', [
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
        Validators.pattern('^[0-9]*$')
      ]),
      zipCode: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern('^[0-9]*$')
      ])
    });
  }
  
  loadAddress(id: number) {
    this.addressService.showAddress(id).subscribe(
      (response) => {
        console.log(response);
        this.form.patchValue({
          state: response.address.state,
          city: response.address.city,
          neighborhood: response.address.neighborhood,
          street: response.address.street,
          number: response.address.number,
          zipCode: response.address.zip_code
        });
      },
      (error) => {
        console.error('Error fetching address:', error);
      }
    );
  }

  onSubmit() {
    const formData = {
      state: this.form.controls['state'].value,
      city: this.form.controls['city'].value,
      neighborhood: this.form.controls['neighborhood'].value,
      street: this.form.controls['street'].value,
      number: this.form.controls['number'].value,
      zip_code: this.form.controls['zipCode'].value
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