import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CardComponent } from '../../../../shared/card/card.component'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink } from '@angular/router'
import { DatePipe, CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { SweetAlert2LoaderService, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import { IncubatorsService } from '../../../../../services/incubators.service'
import { switchMapTo } from 'rxjs'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-incubator-card',
  standalone: true,
  imports: [CardComponent, MatIconModule, RouterLink, CommonModule, MatButtonModule, SweetAlert2Module],
  templateUrl: './incubator-card.component.html',
  styleUrl: './incubator-card.component.css',
  providers: [DatePipe],
})
export class IncubatorCardComponent {
  @Input() id!: number
  @Input() state!: string
  @Input() room_number!: number
  @Input() nurse!: string
  @Input() baby!: string
  @Input() date!: Date | string
  @Output() reloadIncubators = new EventEmitter()
  @Output() alertDelete = new EventEmitter()

  constructor(private datePipe: DatePipe, private incubatorsService: IncubatorsService) { }

  formatDate(date: Date | string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || 'Invalid Date'
  }

  getStateIcon(state: string): string {
    switch (state) {
      case 'available': return 'check_circle'
      case 'active': return 'block'
      default: return 'help_outline'
    }
  }


  delete(incubator_id: number) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this incubator?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.incubatorsService.delete(incubator_id).subscribe(
          () => {
            Swal.fire('Deleted!', 'The incubator has been deleted.', 'success')
            this.reloadIncubators.emit() 
          },
          (error) => {
            Swal.fire('Error', 'Failed to delete the incubator.', 'error')
          }
        )
      }
    })
  }
}