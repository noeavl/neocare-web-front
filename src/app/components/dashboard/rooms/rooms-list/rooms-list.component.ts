import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { RoomsService } from '../../../../services/rooms.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { RoomCardComponent } from './room-card/room-card.component';
import { CommonModule, NgIf } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HospitalService } from '../../../../services/hospital.service';
import { ButtonComponent } from '../../../shared/button/button.component';
import { SelectComponent } from '../../../shared/select/select.component';
import { CardComponent } from '../../../shared/card/card.component';
import { AuthService } from '../../../../services/auth.service';
@Component({
  selector: 'app-rooms-list',
  imports: [
      SectionHeaderComponent, 
      ToastModule, 
      MatProgressSpinner, 
      MatPaginator, 
      RoomCardComponent, 
      CommonModule, 
      ReactiveFormsModule, 
      ButtonComponent, 
      SelectComponent, 
      CardComponent,
      NgIf
    ],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css',
  providers: [MessageService]
})

export class RoomsListComponent {
  hospitals: any[] = []
  rooms: Rooms[] = []
  isSearching: boolean = false
  dataLoaded = false
  totalItems: number = 0
  pageSize: number = 9
  currentPage: number = 0
  role: string = ''
  showButton: boolean = false

  formFilter = new FormGroup({
    hospital_id: new FormControl('', Validators.required)
  })

  get hospital_id() {
    return this.formFilter.get('hospital_id')
  }

  constructor(
    private roomsService: RoomsService,
    private messageService: MessageService,
    private hospitalsService: HospitalService,
    private authService: AuthService
  ) { }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  ngOnInit() {
    this.getHospitals()

    this.authService.userRole().subscribe({
      next: (response) => {
        this.showButton = this.role !== 'nurse'
        this.role = response.role
        if (response.role === 'nurse-admin' || response.role === 'nurse') {
          this.formFilter.controls['hospital_id'].setValue(response.hospital_id)
          this.getRooms(0)
        }
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            this.showAlert('error', 'Error', 'Fail to connect to the server');
          } else if (error.status === 404) {
            this.showAlert('warn', 'Error', error.error.message);
          } else if (error.status === 401) {
            this.showAlert('error', 'Error', error.error.message);
          } else {
            this.showAlert('error', 'Error', error.error.message);
          }
        }
      }
    })
  }

  getRooms(page: number) {
    this.isSearching = true
    this.roomsService.index(page + 1, Number(this.formFilter.controls.hospital_id.value)).subscribe({
      next: (response) => {
        this.rooms = response.rooms.data
        this.totalItems = response.rooms.total
        this.currentPage = response.rooms.current_page - 1
        this.isSearching = false
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            this.showAlert('error', 'Error', 'Fail to connect to the server');
          } else if (error.status === 404) {
            this.rooms = []
            this.showAlert('warn', 'Error', error.error.message);
          } else if (error.status === 401) {
            this.showAlert('error', 'Error', error.error.message);
          } else {
            this.showAlert('error', 'Error', error.error.message);
          }
          this.isSearching = false
          this.totalItems = 0
          this.currentPage = 0
        }
      }
    })
  }
  handleSelection(value: string): void {
    this.formFilter.controls['hospital_id'].setValue(value)
  }

  onSubmit(event: Event) {
    event.preventDefault()
    window.scrollTo(0, 0)
    this.currentPage = 0
    this.getHospitals()
  }
  getHospitals() {
    this.hospitalsService.indexNoPaginate().subscribe({
      next: (response) => {
        this.hospitals = response.hospitals.map((hospital: any) => ({
          value: hospital.id.toString(),
          label: hospital.name
        }))
        this.dataLoaded = true
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            this.showAlert('error', 'Error', 'Fail to connect to the server');
          } else if (error.status === 404) {
            this.showAlert('warn', 'Error', error.error.message);
          } else if (error.status === 401) {
            this.showAlert('error', 'Error', error.error.message);
          } else {
            this.showAlert('error', 'Error', error.error.message);
          }
        }
      }
    })
  }
  manageDeletion(event: any) {
    if (event.status == 404) {
      this.showAlert('error', 'Error', event.error.message)
    } else {
      this.showAlert('success', 'Success', event.message)
    }
  }
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex
    this.getRooms(this.currentPage)
  }
}

interface Rooms {
  id: number
  name: string
  number: number
  created_at: Date
}
