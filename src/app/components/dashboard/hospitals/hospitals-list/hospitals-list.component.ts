import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { HospitalCardComponent } from './hospital-card/hospital-card.component';
import { HospitalService } from '../../../../services/hospital.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-hospitals-list',
  imports: [SectionHeaderComponent, HospitalCardComponent, ToastModule, CommonModule, MatProgressSpinnerModule, MatPaginatorModule],
  templateUrl: './hospitals-list.component.html',
  styleUrl: './hospitals-list.component.css',
  providers: [MessageService]
})
export class HospitalsListComponent {
  hospitals: Hospital[] = []
  dataLoad = false
  totalItems: number = 0
  pageSize: number = 9
  currentPage: number = 0
  constructor(private hospitalService: HospitalService, private messageService: MessageService) { }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }
  ngOnInit() {
    this.getHospitals(this.currentPage)
  }
  manageDeletion(event: any) {
    if (event.status == 404) {
      this.showAlert('error', 'Error', event.error.message)
    } else {
      this.showAlert('success', 'Success', event.message)
    }
  }

  getHospitals(page: number) {
    this.hospitalService.index(page + 1).subscribe({
      next: (response) => {
        this.hospitals = response.hospitals.data
        this.totalItems = response.hospitals.total
        this.currentPage = response.hospitals.current_page - 1
        this.dataLoad = true
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status == 0) {
            this.showAlert('error', 'Error', 'Error de conexion al servidor');
          }
          this.totalItems = 0
          this.currentPage = 0
        }
      }
    })
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex
    this.getHospitals(this.currentPage)
  }
}

interface Hospital {
  id: number
  phone_number: number
  name: string
  city: string
  created_at: Date
}
