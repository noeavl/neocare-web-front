import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { CardComponent } from '../../../shared/card/card.component';
import { ActivatedRoute } from '@angular/router';
import { HospitalService } from '../../../../services/hospital.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from '../../../shared/icon/icon.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-hospitals-detail',
  imports: [SectionHeaderComponent, CardComponent, ToastModule, MatIconModule, IconComponent, MatProgressSpinnerModule, CommonModule],
  templateUrl: './hospitals-detail.component.html',
  styleUrl: './hospitals-detail.component.css',
  providers: [MessageService]
})
export class HospitalsDetailComponent {
  hospital!: Hospital
  id: number
  dataLoad = false
  constructor(private route: ActivatedRoute, private hospitalService: HospitalService, private messageService: MessageService) {
    this.id = this.route.snapshot.params['id'];
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  ngOnInit() {
    this.getHospital()
  }

  getHospital() {
    this.hospitalService.show(this.id).subscribe({
      next: (response) => {
        this.hospital = response.hospital
        this.dataLoad = true
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status == 0) {
            this.showAlert('error', 'Error', 'Fail to connect to the server');
          }
        }
      }
    })
  }
}

interface Hospital {
  id: number
  name: string
  phone_number: number
  created_at: Date
  address: {
    id: number
    street: string
    neighborhood: string
    city: string
    state: string
    number: number
    zip_code: number
  }
  total_babies: number
  total_incubators: number
  total_rooms: number
  total_nurses: number
}