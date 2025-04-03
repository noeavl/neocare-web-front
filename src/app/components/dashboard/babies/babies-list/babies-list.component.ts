import { Component, OnInit, ViewChild } from '@angular/core';
import { BabiesService } from '../../../../services/babies.service';
import { MessageService } from 'primeng/api';
import { BabiesCardComponent } from './babies-card/babies-card.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatSpinner } from '@angular/material/progress-spinner';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { ToastModule } from 'primeng/toast';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ButtonComponent } from '../../../shared/button/button.component';
import { MatPaginator } from '@angular/material/paginator';
import { HospitalService } from '../../../../services/hospital.service';
import { CardComponent } from '../../../shared/card/card.component';
import { AuthService } from '../../../../services/auth.service';
@Component({
  selector: 'app-babies-list',
  imports: [BabiesCardComponent, NgFor, ToastModule, MatSpinner, SectionHeaderComponent,
    MatPaginator, ReactiveFormsModule, ButtonComponent, NgIf, CommonModule, CardComponent],
  templateUrl: './babies-list.component.html',
  styleUrl: './babies-list.component.css',
  providers: [MessageService]
})
export class BabiesListComponent implements OnInit {
  babies: any[] = []
  totalItems: number = 0
  pageSize: number = 6
  currentPage: number = 0
  dataLoaded = false
  incubators: any[] = []
  hospitals: any[] = []
  role: string = ''
  hospitalId: number | null = 0

  formFilter = new FormGroup({
    hospital_id: new FormControl<number | null>(null)
  });
  
  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    private babiesService: BabiesService,
    private messageService: MessageService,
    private hospitalsService: HospitalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadHospitals();

    this.authService.userRole().subscribe(
      (response) => {
        this.role = response.role;
        
        // Solo asignar hospitalId para nurses
        if (this.role === 'nurse' || this.role === 'nurse-admin') {
          this.hospitalId = response.hospital_id;
          this.formFilter.controls['hospital_id'].setValue(this.hospitalId);
          this.formFilter.controls['hospital_id'].disable(); // Opcional: deshabilitar el control
        }
        
        // Cargar bebés después de determinar el rol
        this.loadBabies();
      },
      (error) => {
        this.showAlert("error", "Error", "No se pudo obtener el rol del usuario.");
      }
    );
  }

  loadHospitals() {
    this.hospitalsService.indexNoPaginate().subscribe(
      (response) => {
        this.hospitals = response.hospitals || []
        this.dataLoaded = true
      },
      (error) => {
        this.showAlert("error", "Error", "Could not load hospitals.")
      }
    )
  }

  loadBabies() {
    this.dataLoaded = false;
    this.babies = [];

    let filtros: any = {};

    // Solo aplicar filtro de hospital para nurses
    if (this.role === 'nurse' || this.role === 'nurse-admin') {
      filtros.hospital_id = this.hospitalId;
    } else {
      // Para admin/super-admin, usar el filtro seleccionado (si existe)
      const selectedHospitalId = this.formFilter.get('hospital_id')?.value;
      if (selectedHospitalId) {
        filtros.hospital_id = selectedHospitalId;
      }
    }

    this.babiesService.index(this.currentPage + 1, filtros).subscribe(
      (response) => {
        this.babies = response.data || [];
        this.totalItems = response.total || 0;
        this.pageSize = response.per_page || 6;
        this.currentPage = response.current_page - 1;
        this.dataLoaded = true;
      },
      (error) => {
        this.showAlert("error", "Error", "No se pudieron cargar los bebés.");
        this.dataLoaded = true;
        this.babies = [];
      }
    );
  }

  onSubmit(event: Event) {
    event.preventDefault()
    window.scrollTo(0, 0)
    this.loadBabies()
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex
    this.pageSize = event.pageSize
    this.loadBabies()
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail })
  }

  manageDeletion(event: any) {
    if (event.status == 404) {
      this.showAlert('error', 'Error', event.error.msg)
    } else {
      this.showAlert('success', 'Success', event.msg)
    }
  }
}
