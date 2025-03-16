import { Component, Input } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { CardComponent } from '../../../../shared/card/card.component'
import { RouterLink } from '@angular/router'
import { Output, EventEmitter } from '@angular/core'
import { IncubatorsService } from '../../../../../services/incubators.service'
import { SweetAlert2LoaderService } from '@sweetalert2/ngx-sweetalert2'

@Component({
  selector: 'app-hospital-card',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CardComponent, RouterLink],
  templateUrl: './hospital-card.component.html',
  styleUrl: './hospital-card.component.css'
})
export class HospitalCardComponent {
  @Input() id!: number
  @Input() name!: string
  @Input() date!: Date
  @Input() phone!: number
  @Input() city!: string

  @Output() reloadIncubators = new EventEmitter()
  @Output() alertDelete = new EventEmitter()

  constructor(private incubatorsService: IncubatorsService) {}

  delete(incubator_id: number) {
    this.incubatorsService.delete(incubator_id).subscribe(
      (response) => {
        console.log(response)
        this.alertDelete.emit(response)
        this.reloadIncubators.emit()
      },
      (error) => {
        console.log(error)
        this.alertDelete.emit(error)
      }
    )
  }
}