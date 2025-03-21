import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/card/card.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { MatIconModule } from '@angular/material/icon';
import { RoomsService } from '../../../../services/rooms.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { RoomIncubatorCardComponent } from './room-incubator-card/room-incubator-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
@Component({
  selector: 'app-rooms-detail',
  imports: [CardComponent, IconComponent, MatIconModule, ToastModule, RoomIncubatorCardComponent, CommonModule, NgxPaginationModule, MatProgressSpinner, SectionHeaderComponent],
  templateUrl: './rooms-detail.component.html',
  styleUrl: './rooms-detail.component.css',
  providers: [MessageService]
})
export class RoomsDetailComponent {
  page: number = 1; 
  id:number
  room!:Room
  dataLoaded: boolean = false
  incubators:Incubator[] = []
  total_incubators!: number
  total_babies!: number
  constructor(private roomsService: RoomsService, private messageService: MessageService, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  getRoom() {
    this.dataLoaded = false
    this.roomsService.show(this.id).subscribe({
      next: (response) => {
        this.room = response.room
        this.total_babies = response.total_babies
        this.total_incubators = response.total_incubators
        this.incubators = response.incubators
        this.dataLoaded = true
      },
      error: (error) => {
        this.dataLoaded = true
        this.showAlert('error', 'Error', error.error.message)
      } 
    })
  }
  ngOnInit() {
    this.getRoom()
  }
}
interface Room {
  id: number
  name: string
  hospital: {
    name : string
  }
  number: number
  created_at: Date
}
interface Incubator{
  id: number
  name: string
  state: string
  nurse_full_name: string
  baby_full_name: string
}
