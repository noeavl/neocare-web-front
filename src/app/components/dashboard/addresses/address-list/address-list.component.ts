import { Component, OnInit } from '@angular/core';
import { AddressCardComponent } from "./address-card/address-card.component";
import { AddressService } from '../../../../services/address.service';

@Component({
  selector: 'app-address-list',
  imports: [AddressCardComponent],
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {
  addresses: any[] = [];

  constructor(private addressService: AddressService) {}

  ngOnInit(): void {
    this.addressService.indexAddress().subscribe(
      (response) => {
        this.addresses = response.addresses
        console.log(this.addresses)
      }, 
      (error) => {
        console.log(error)
      }
    );
  }
}
