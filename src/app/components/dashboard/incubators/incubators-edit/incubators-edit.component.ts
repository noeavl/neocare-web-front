import { Component } from '@angular/core'
import { SectionHeaderComponent } from '../../section-header/section-header.component'
import { IncubatorsService } from '../../../../services/incubators.service'
import { ActivatedRoute, Router } from '@angular/router'
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
  hospital_id: any = sessionStorage.getItem('selectedHospitalId')

  form = new FormGroup({
    room_id: new FormControl({ value: null, disabled: true }, Validators.required),
    state: new FormControl({ value: '', disabled: true }, Validators.required)
  })

  constructor(
    private incubatorsService: IncubatorsService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private roomsService: RoomsService,
    private router: Router
  ) {}

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 })
  }

  ngOnInit() {
    this.loadIncubator(this.route.snapshot.params['id'])
    this.loadRooms(this.hospital_id)
  }

  onSubmit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    this.incubatorsService.update(this.route.snapshot.params['id'], this.form.value).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Incubadora actualizada' })
        this.loadIncubator(this.route.snapshot.params['id'])
        this.showAlert('success', 'Success', 'Incubator updated successfully')
      },
      (error) => {
        console.log(error)
        this.showAlert('error', 'Error', "Incubator couldn't be updated")
      }
    )
  }

  loadIncubator(id: number) {
    this.incubatorsService.show(id).subscribe(
      (response) => {
        console.log(response)
        this.incubator = response.incubator
        this.form.patchValue({
          room_id: this.incubator.room_id,
          state: this.incubator.state
        })
        this.dataLoaded = true
        this.form.enable()
      },
      (error) => {
        console.log(error)
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

    this.roomsService.getRoomsByHospital(id).subscribe(
      (response) => {
        console.log(response)
        this.rooms = response
        if (this.rooms.length > 0) {
          this.form.get('room_id')?.enable()
        }
      },
      (error) => console.log(error)
    )
  }

  trackById(index: number, item: any): number {
    return item.id
  }
}