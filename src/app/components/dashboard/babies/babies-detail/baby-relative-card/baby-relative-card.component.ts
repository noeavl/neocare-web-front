import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CardComponent } from '../../../../shared/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RelativesService } from '../../../../../services/relatives.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-baby-relative-card',
  imports: [CardComponent, CommonModule, MatIconModule, SweetAlert2Module, RouterLink],
  templateUrl: './baby-relative-card.component.html',
  styleUrl: './baby-relative-card.component.css'
})
export class BabyRelativeCardComponent {
  @Input() id!: number;
  @Input() email!: string;
  @Input() phone_number!: string;
  @Input() name!: string;
  @Input() last_name_1!: string;
  @Input() last_name_2!: string;
  @Output() alertDelete = new EventEmitter<number>();

  delete(id: number) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this familiar?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.alertDelete.emit(id); // Emitir el evento al componente padre
      }
    });
  }
}