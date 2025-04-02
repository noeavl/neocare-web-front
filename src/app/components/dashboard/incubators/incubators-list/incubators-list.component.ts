import { Component, OnInit, ViewChild } from '@angular/core'
import { IncubatorsService } from '../../../../services/incubators.service'
import { MatPaginator } from '@angular/material/paginator'
import { MessageService } from 'primeng/api'
import { IncubatorCardComponent } from './incubator-card/incubator-card.component'
import { NgFor, NgIf } from '@angular/common'
import { MatSpinner } from '@angular/material/progress-spinner'
import { SectionHeaderComponent } from '../../section-header/section-header.component'
import { ToastModule } from 'primeng/toast'
import { HospitalService } from '../../../../services/hospital.service'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ButtonComponent } from '../../../shared/button/button.component'
import { CardComponent } from "../../../shared/card/card.component"
import { AuthService } from '../../../../services/auth.service'

@Component({
  selector: 'app-incubators-list',
  standalone: true,
  imports: [
    IncubatorCardComponent,
    NgFor,
    ToastModule,
    MatSpinner,
    SectionHeaderComponent,
    MatPaginator,
    ReactiveFormsModule,
    ButtonComponent,
    NgIf,
    CardComponent
  ],
  templateUrl: './incubators-list.component.html',
  styleUrl: './incubators-list.component.css',
  providers: [MessageService]
})
export class IncubatorsListComponent implements OnInit {
  incubators: any[] = []
  totalItems: number = 0
  pageSize: number = 6
  currentPage: number = 0
  dataLoaded = false
  hospitals: any[] = []
  role: string = ''
  hospitalId: number = 0
  showButton: boolean = false

  formFilter = new FormGroup({
    hospital_id: new FormControl<number | null>(null, Validators.required),
    room_id: new FormControl<number | null>(null, Validators.required)
  })

  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    private incubatorsService: IncubatorsService,
    private messageService: MessageService,
    private hospitalsService: HospitalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // En el ngOnInit donde manejas el rol
    this.authService.userRole().subscribe(
      (response) => {
        this.role = response.role
        this.hospitalId = response.hospital_id

        // Determinar si mostrar botones (mostrar para todos excepto nurse)
        this.showButton = this.role !== 'nurse'

        if (this.role === 'nurse') {
          this.formFilter.get('hospital_id')?.setValue(this.hospitalId)
          this.loadIncubators()
        } else {
          this.loadHospitals().then(() => {
            const savedHospitalId = sessionStorage.getItem('selectedHospitalId')
            const hospitalId = savedHospitalId ? Number(savedHospitalId) : null
            if (hospitalId) {
              this.formFilter.get('hospital_id')?.setValue(hospitalId)
            }
            this.loadIncubators()
          })
        }
      },
      (error) => {
        console.error('Error al obtener el rol:', error)
      }
    )
  }

  loadHospitals(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.hospitalsService.indexNoPaginate().subscribe(
        (response) => {
          this.hospitals = response.hospitals || []
          resolve()
        },
        (error) => {
          this.showAlert("error", "Error", "Could not load hospitals.")
          reject(error)
        }
      )
    })
  }

  loadIncubators() {
    this.dataLoaded = false
    this.incubators = []

    let filtros: any = {}

    if (this.role === 'nurse' || this.role === 'nurse-admin') {
      filtros.hospital_id = this.hospitalId
      this.formFilter.get('hospital_id')?.setValue(this.hospitalId)
    } else if (this.formFilter.value.hospital_id) {
      filtros.hospital_id = this.formFilter.value.hospital_id
    }

    if (this.formFilter.value.room_id) {
      filtros.room_id = this.formFilter.value.room_id
    }

    if (this.role !== 'nurse' && this.role !== 'nurse-admin' && filtros.hospital_id) {
      sessionStorage.setItem('selectedHospitalId', String(filtros.hospital_id))
    }

    this.incubatorsService.index(this.currentPage + 1, filtros).subscribe(
      (response) => {
        this.incubators = response.incubators || []
        this.totalItems = response.total || 0
        this.pageSize = response.per_page || 6
        this.currentPage = response.current_page - 1
        this.dataLoaded = true
      },
      (error) => {
        console.error('Error al cargar incubadoras:', error)
        this.showAlert("error", "Error", "Could not load incubators.")
        this.dataLoaded = true
      }
    )
  }

  onSubmit(event: Event) {
    event.preventDefault()
    window.scrollTo(0, 0)
    this.loadIncubators()
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex
    this.pageSize = event.pageSize
    this.loadIncubators()
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