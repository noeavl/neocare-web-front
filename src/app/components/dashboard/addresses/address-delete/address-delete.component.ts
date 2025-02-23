import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AddressService } from '../../../../services/address.service';

@Component({
  selector: 'app-address-delete',
  imports: [
    RouterLink
  ],
  templateUrl: './address-delete.component.html',
  styleUrl: './address-delete.component.css'
})
export class AddressDeleteComponent implements OnInit {
  router = inject(Router);
  id!: number

  constructor(
    private route: ActivatedRoute,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'))
    });

    console.log(this.id)
  }

  onClickDelete() {
    this.addressService.deleteAddress(this.id).subscribe(
      (response) => {
        console.log("item deleted")
        this.router.navigate(['/dashboard/addresses/list'])
      }
    )
  }
}