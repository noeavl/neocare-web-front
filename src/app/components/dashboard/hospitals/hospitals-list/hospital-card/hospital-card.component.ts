import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CardComponent } from '../../../../shared/card/card.component';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HospitalService } from '../../../../../services/hospital.service';
@Component({
  selector: 'app-hospital-card',
  imports: [MatIconModule, MatButtonModule, CardComponent, RouterLink, SweetAlert2Module],
  templateUrl: './hospital-card.component.html',
  styleUrl: './hospital-card.component.css'
})
export class HospitalCardComponent {
  constructor(private hospitalService: HospitalService) { }

  @Input() id!: number
  @Input() name!: string
  @Input() date!: Date
  @Input() phone!: number
  @Input() city!: string
  @Output() reloadData = new EventEmitter()
  @Output() alertDelete = new EventEmitter()

  delete(id: number) {
    this.hospitalService.delete(id).subscribe({
      next: (response) => {
        this.reloadData.emit();
        this.alertDelete.emit(response);
      },
      error: (error) => {
        this.alertDelete.emit(error)
      }
    })
  }
}
