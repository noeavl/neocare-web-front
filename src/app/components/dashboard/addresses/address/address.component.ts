import { Component, OnInit } from '@angular/core';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { AddressService } from '../../../../services/address.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-address',
  imports: [
    SectionHeaderComponent
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent implements OnInit {
  constructor (
    private addressService: AddressService,
    private route: ActivatedRoute
  ) {}

  id!: number
  state!: string
  city!: string
  neighbourhood!: string
  street!: string
  number!: number
  zip_code!: string

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'))
      this.loadAddress(this.id)
    })
  }

  loadAddress(id: number) {
    this.addressService.showAddress(this.id).subscribe(
      (response) => {
        this.state = response.address.state
        this.city = response.address.city
        this.neighbourhood = response.address.neighborhood
        this.street = response.address.street
        this.number = response.address.number
        this.zip_code = response.address.zip_code
      }
    )
  }
}
