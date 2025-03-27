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
    NgIf
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

  formFilter = new FormGroup({
    hospital_id: new FormControl<number | null>(null, Validators.required)
  })

  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    private incubatorsService: IncubatorsService,
    private messageService: MessageService,
    private hospitalsService: HospitalService
  ) {}

  ngOnInit(): void {
    this.loadHospitals()

    const savedHospitalId = sessionStorage.getItem('selectedHospitalId')
    const hospitalId = savedHospitalId !== null ? Number(savedHospitalId) : null

    if (hospitalId) {
      this.formFilter.get('hospital_id')?.setValue(hospitalId)
      this.loadIncubators()
    }
  }

  loadHospitals() {
    this.hospitalsService.indexNoPaginate().subscribe(
      (response) => {
        this.hospitals = response.hospitals || []
        this.dataLoaded = true
      },
      () => {
        this.showAlert("error", "Error", "Could not load hospitals.")
      }
    )
  }

  loadIncubators() {
    this.dataLoaded = false
    this.incubators = []

    const hospitalId = this.formFilter.get('hospital_id')?.value

    if (!hospitalId) {
      this.dataLoaded = true
      return
    }

    sessionStorage.setItem('selectedHospitalId', String(hospitalId))

    const filtros = { hospital_id: hospitalId }

    this.incubatorsService.index(this.currentPage + 1, filtros).subscribe(
      (response) => {
        this.incubators = response.incubators || []
        this.totalItems = response.total || 0
        this.pageSize = response.per_page || 6
        this.currentPage = response.current_page - 1
        this.dataLoaded = true
      },
      (error) => {
        this.showAlert("error", "Error", "Could not load incubators.")
        this.dataLoaded = true
        this.incubators = []
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