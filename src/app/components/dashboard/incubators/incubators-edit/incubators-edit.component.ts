import { Component } from '@angular/core'
import { SectionHeaderComponent } from '../../section-header/section-header.component'
import { IncubatorsService } from '../../../../services/incubators.service'
import { ActivatedRoute } from '@angular/router'
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms'
import { MatSpinner } from '@angular/material/progress-spinner'
import { CardComponent } from '../../../shared/card/card.component'
import { MessageService } from 'primeng/api'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import { ToastModule } from 'primeng/toast'
import { ButtonComponent } from '../../../shared/button/button.component'
import { RoomsService } from '../../../../services/rooms.service'
import { CommonModule } from '@angular/common'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { NursesService } from '../../../../services/nurses.service'
import { BabiesService } from '../../../../services/babies.service'

@Component({
  selector: 'app-incubators-edit',
  standalone: true,
  imports: [
    CommonModule,
    SectionHeaderComponent,
    MatSpinner,
    CardComponent,
    ReactiveFormsModule,
    SweetAlert2Module,
    ToastModule,
    ButtonComponent,
    InputTextModule,
    DropdownModule
  ],
  templateUrl: './incubators-edit.component.html',
  styleUrl: './incubators-edit.component.css',
  providers: [MessageService]
})
export class IncubatorsEditComponent {
  dataLoaded = false
  incubator: any
  rooms: any[] = []
  nurses: any[] = []
  babies: any[] = []
  hospital_id: any = sessionStorage.getItem('selectedHospitalId')
  isAssigned = false

  form = new FormGroup({
    baby_id: new FormControl(null, Validators.required),
    nurse_id: new FormControl(null, Validators.required),
    room_id: new FormControl(null, Validators.required),
    state: new FormControl('', Validators.required)
  })

  constructor(
    private incubatorsService: IncubatorsService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private roomsService: RoomsService,
    private nursesService: NursesService,
    private babiesService: BabiesService
  ) { }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, key: 'br', life: 3000 })
  }

  ngOnInit() {
    this.loadIncubator(this.route.snapshot.params['id'])
    this.loadRooms(this.hospital_id)
    this.loadNurses(this.hospital_id)
    this.loadBabies(this.hospital_id)
  }

  onSubmit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const baby_id = this.form.get('baby_id')?.value
    const nurse_id = this.form.get('nurse_id')?.value
    const room_id = this.form.get('room_id')?.value
    const incubator_id = this.route.snapshot.params['id']
    const hospital_id = this.hospital_id

    if (!baby_id || !nurse_id) {
      this.showAlert('error', 'Error', 'Please select a baby and a nurse.')
      return
    }

    this.babiesService.assignBabyToIncubator({ baby_id, nurse_id, room_id, incubator_id, hospital_id }).subscribe(
      () => {
        this.showAlert('success', 'Success', 'Baby and Nurse assigned successfully')
        this.isAssigned = true

        this.incubatorsService.update(incubator_id, this.form.value).subscribe(
          (response) => {
            this.showAlert('success', 'Success', 'Incubator updated successfully')

          },
          (error) => {
            this.showAlert('error', 'Error', "Incubator couldn't be updated")
          }
        )
      },
      () => {
        this.showAlert('error', 'Error', "Couldn't assign baby and nurse to incubator")
      }
    )
  }

  loadIncubator(id: number) {
    this.incubatorsService.show(id).subscribe(
      (response) => {
        this.incubator = response.incubator
        this.form.patchValue({
          baby_id: this.incubator.baby_id,
          nurse_id: this.incubator.nurse_id,
          room_id: this.incubator.room_id,
          state: this.incubator.state
        })

        this.isAssigned = !!(this.incubator.baby_id && this.incubator.nurse_id)
        this.dataLoaded = true
      },
      () => {
        this.showAlert("error", "Error", "Could not load incubator data.")
      }
    )
  }

  loadRooms(hospitalId: number) {
    this.roomsService.getRoomsByHospital(Number(hospitalId)).subscribe(
      (response) => {
        this.rooms = response.rooms.data
      },
    )
  }

  loadNurses(hospital_id: number) {
    this.nursesService.index(hospital_id).subscribe(
      (response) => {
        this.nurses = response.data
      },
      () => {
        this.nurses = []
      }
    )
  }

  loadBabies(hospital_id: number) {
    this.babiesService.indexNoPaginate({ hospital_id }).subscribe(
      (response) => {
        this.babies = response.babies || []
      },
      () => {
        this.showAlert("error", "Error", "Could not load babies.")
        this.babies = []
      }
    )
  }

  assignBabyToIncubator() {
    const baby_id = this.form.get('baby_id')?.value
    const nurse_id = this.form.get('nurse_id')?.value
    const room_id = this.form.get('room_id')?.value
    const incubator_id = this.route.snapshot.params['id']
    const hospital_id = this.hospital_id

    if (!baby_id || !nurse_id) {
      this.showAlert('error', 'Error', 'Please select a baby and a nurse.')
      return
    }

    this.babiesService.assignBabyToIncubator({ baby_id, nurse_id, room_id, incubator_id, hospital_id }).subscribe(
      () => {
        this.showAlert('success', 'Success', 'Baby assigned to incubator successfully')
        this.isAssigned = true
      },
      () => {
        this.showAlert('error', 'Error', "Couldn't assign baby to incubator")
      }
    )
  }

  trackById(index: number, item: any): number {
    return item.id
  }
}