import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '../../../../shared/card/card.component';
import { RoomsService } from '../../../../../services/rooms.service';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-room-card',
  imports: [MatIconModule, CardComponent, RouterLink, SweetAlert2Module, MatButtonModule],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.css'
})
export class RoomCardComponent {

  @Input() id!: number
  @Input() name!: string
  @Input() number!: number
  @Input() date!: Date
  @Output() reloadData = new EventEmitter()
  @Output() alertDelete = new EventEmitter()

  constructor(private roomService: RoomsService) { }
  delete(id: number) {
    this.roomService.delete(id).subscribe({
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
