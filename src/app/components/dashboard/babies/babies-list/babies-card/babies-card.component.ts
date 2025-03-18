import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '../../../../shared/card/card.component';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BabiesService } from '../../../../../services/babies.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-babies-card',
  imports: [MatIconModule, MatButtonModule, CardComponent, RouterLink, SweetAlert2Module],
  templateUrl: './babies-card.component.html',
  styleUrl: './babies-card.component.css'
})
export class BabiesCardComponent {
  @Input() id!: number
  @Input() incubator_id!: number
  @Input() birth_date!: Date
  @Input() name!: string
  @Input() last_name_1!: string
  @Input() last_name_2!: string
  @Input() created_at!: Date
  @Output() reloadBabies = new EventEmitter()
  @Output() alertDelete = new EventEmitter()

  constructor(private babiesService: BabiesService) { }

  getStateIcon(state: string): string {
    switch (state) {
      case 'available': return 'check_circle'
      case 'active': return 'block'
      default: return 'help_outline'
    }
  }

  delete(baby_id: number) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this baby?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.babiesService.delete(baby_id).subscribe(
          () => {
            Swal.fire('Deleted!', 'The baby has been deleted.', 'success')
            this.reloadBabies.emit() 
          },
          (error) => {
            Swal.fire('Error', 'Failed to delete the baby.', 'error')
          }
        )
      }
    })
  }
}
