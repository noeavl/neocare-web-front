import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-address-card',
  imports: [
    RouterLink
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
}
