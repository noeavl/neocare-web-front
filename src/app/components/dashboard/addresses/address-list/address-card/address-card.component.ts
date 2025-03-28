import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AddressService } from '../../../../../services/address.service';
import { CardComponent } from "../../../../shared/card/card.component";

@Component({
  selector: 'app-address-card',
  imports: [
    RouterLink,
    SweetAlert2Module,
    CardComponent
],
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.css']
})
export class AddressCardComponent {
  @Input({ required: true }) id!: number
  @Input({ required: true }) state!: string
  @Input({ required: true }) city!: string
  @Input({ required: true }) street!: string
  @Input({ required: true }) neighborhood!: string
  @Input({ required: true }) number!: string
  @Input({ required: true }) zip_code!: string
  @Output() reloadAddresses = new EventEmitter()
  @Output() alertDelete = new EventEmitter()

  constructor(
    private addressService: AddressService
  ) { }

  delete(addressId: number) {
    this.addressService.deleteAddress(this.id).subscribe(
      (response) => {
        this.alertDelete.emit(response)
        this.reloadAddresses.emit()
      },
      (error) => {
        this.alertDelete.emit(error)
      }
    )
  }
}
