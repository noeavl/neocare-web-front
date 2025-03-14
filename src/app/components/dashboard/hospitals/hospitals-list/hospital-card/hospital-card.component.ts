import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CardComponent } from '../../../../shared/card/card.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-hospital-card',
  imports: [MatIconModule, MatButtonModule, CardComponent, RouterLink],
  templateUrl: './hospital-card.component.html',
  styleUrl: './hospital-card.component.css'
})
export class HospitalCardComponent {
  @Input() id!: number;
  @Input() name!: string;
  @Input() date!: Date;
  @Input() phone!: number;
  @Input() city!: string;
}
