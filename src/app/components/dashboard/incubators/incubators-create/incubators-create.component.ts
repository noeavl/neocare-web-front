import { Component } from '@angular/core'
import { IncubatorsService } from '../../../../services/incubators.service'
import { RoomsService } from '../../../../services/rooms.service'
import { HospitalService } from '../../../../services/hospital.service'
import { SectionHeaderComponent } from '../../section-header/section-header.component'
import { NgFor } from '@angular/common'
import { CardComponent } from '../../../shared/card/card.component'
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { catchError, of } from 'rxjs'
import { ButtonComponent } from '../../../shared/button/button.component'
import { ToastModule } from 'primeng/toast'
import { MatSpinner } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-incubators-create',
  standalone: true,
  imports: [
    SectionHeaderComponent,
    NgFor,
    CardComponent,
    ReactiveFormsModule,
    ButtonComponent,
    ToastModule,
    MatSpinner
  ],
  templateUrl: './incubators-create.component.html',
  styleUrl: './incubators-create.component.css',
  providers: [MessageService]
})
export class IncubatorsCreateComponent {
  hospitals: any[] = []
  rooms: any[] = []
  dataLoaded = false
  errorMessage: string | null = null
  fieldErrors: { [key: string]: string } = {}

  form = new FormGroup({
    hospital_id: new FormControl(null, Validators.required),
    room_id: new FormControl({ value: null, disabled: true }, Validators.required)
  })

  constructor(
    private incubatorsService: IncubatorsService,
    private roomsService: RoomsService,
    private hospitalsService: HospitalService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadHospitals()

    this.form.get('hospital_id')?.valueChanges.subscribe((hospitalId) => {
      if (hospitalId) {
        this.loadRooms(hospitalId)
      } else {
        this.rooms = []
        this.form.get('room_id')?.disable()
      }
    })
  }

  onSubmit() {
    this.form.markAllAsTouched()

    if (this.form.invalid) {
      return
    }

    this.incubatorsService.create(this.form.value).subscribe(
      (response) => {
        this.showAlert("success", "Incubadora creada", response.msg)
        this.form.reset()
      },
      (error) => {
        this.showAlert("error", "Error", error.error.msg)
      }
    )

  }

  loadHospitals() {
    this.hospitalsService.indexNoPaginate().subscribe(
      (response) => {
        this.hospitals = response.hospitals
        this.dataLoaded = true
      },
      (error) => {
        this.showAlert("error", "Error", "No se pudieron cargar los hospitales.")
      }
    )
  }

  loadRooms(hospitalId: number) {
    const id = Number(hospitalId)
    if (!id || isNaN(id)) {
      this.rooms = []
      this.form.get('room_id')?.disable()
      return
    }

    this.roomsService.getRoomsByHospital(id).subscribe((response) => {
      this.rooms = response.rooms.data
      this.form.get('room_id')?.enable()
    }, (error) => {
      this.showAlert("error", "Error", "Could not load rooms.")
    })
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, key: 'br', life: 3000 })
  }

  trackById(index: number, item: any): number {
    return item.id
  }
}