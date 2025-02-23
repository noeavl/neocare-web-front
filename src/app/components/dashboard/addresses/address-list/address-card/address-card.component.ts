import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.css']
})
export class AddressCardComponent {
  @Input({ required: true }) id!: true
  @Input({ required: true }) state!: string
  @Input({ required: true }) city!: string
  @Input({ required: true }) street!: string
  @Input({ required: true }) neighborhood!: string
  @Input({ required: true }) number!: string
  @Input({ required: true }) zip_code!: string
}
