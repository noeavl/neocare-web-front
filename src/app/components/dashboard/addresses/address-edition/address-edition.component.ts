import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../../../services/address.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-address-edition',
  imports: [
    ReactiveFormsModule,
    SectionHeaderComponent,
    ToastModule,
    ButtonModule,
    RippleModule
  ],
  templateUrl: './address-edition.component.html',
  styleUrls: ['./address-edition.component.css'],
  providers: [
    MessageService
  ]
})
export class AddressEditionComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private addressService: AddressService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
  ) { }

  id!: number

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 })
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'))
      this.loadAddress(this.id)
    })

    this.form = new FormGroup({
      state: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),
      city: new FormControl('', [
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
        Validators.pattern('^[0-9]*$')
      ]),
      zipCode: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern('^[0-9]*$')
      ])
    })
  }

  loadAddress(id: number) {
    this.addressService.showAddress(id).subscribe(
      (response) => {
        this.form.patchValue({
          state: response.address.state,
          city: response.address.city,
          neighborhood: response.address.neighborhood,
          street: response.address.street,
          number: response.address.number,
          zipCode: response.address.zip_code
        })
      },
      (error) => {
      }
    )
  }

  onSubmit() {
    const formData = {
      state: this.form.controls['state'].value,
      city: this.form.controls['city'].value,
      neighborhood: this.form.controls['neighborhood'].value,
      street: this.form.controls['street'].value,
      number: this.form.controls['number'].value,
      zip_code: this.form.controls['zipCode'].value
    }

    this.addressService.updateAddress(this.id, formData).subscribe(
      (response) => {
        this.showAlert('success', 'Success', response.msg)
        setTimeout(() => {
          this.router.navigate(['/dashboard/addresses/list'])
        }, 3000)
      },
      (error) => {
      }
    );
  }
}