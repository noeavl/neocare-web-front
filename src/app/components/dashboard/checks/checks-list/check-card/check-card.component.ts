import { Component, Input } from '@angular/core';
import { CardComponent } from "../../../../shared/card/card.component";
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-check-card',
  imports: [
    CardComponent,
    RouterLink,
    MatIcon
  ],
  templateUrl: './check-card.component.html',
  styleUrl: './check-card.component.css'
})
export class CheckCardComponent {

  @Input({ required: true }) baby!: string
  @Input({ required: true }) checkid!: number
  @Input({ required: true }) date!: string
  @Input({ required: true }) description!: string
  @Input({ required: true }) incubator!: number
  @Input({ required: true }) title!: string

  
}
