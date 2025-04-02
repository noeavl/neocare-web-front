import { NgClass, NgFor, NgIf } from '@angular/common'
import { Component, Input, OnChanges } from '@angular/core'
import { MatIcon } from '@angular/material/icon'
import { Router, RouterLink } from '@angular/router'
import { ButtonComponent } from '../../../../shared/button/button.component'
import { AuthService } from '../../../../../services/auth.service'

@Component({
  selector: 'app-incubator-detail',
  templateUrl: './incubator-detail.component.html',
  styleUrls: ['./incubator-detail.component.css'],
  imports: [
    MatIcon,
    NgFor,
    NgClass,
    ButtonComponent,
    NgIf
  ]
})
export class IncubatorDetailComponent implements OnChanges {
  @Input() incubator: any
  incubatorEntries: { label: string; value: any; icon: string }[] = []
  role: string = ''

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.userRole().subscribe(
      (response) => {
        console.log(response)
        this.role = response.role
      },
      (error) => {
      }
    )
  }

  navigateToCreateCheck() {
    this.router.navigate(['/dashboard/checks/create'], {
      state: { incubator: this.incubator }
    });
  }

  ngOnChanges() {
    if (this.incubator) {
      const formattedDate = new Date(this.incubator.created_at).toISOString().split('T')[0]

      this.incubatorEntries = [
        { label: 'Baby', value: this.incubator.baby, icon: 'child_friendly' },
        { label: 'Nurse', value: this.incubator.nurse, icon: 'medical_services' },
        { label: 'Room Number', value: this.incubator.room_number, icon: 'meeting_room' },
        { label: 'Status', value: this.incubator.state, icon: 'check_circle' },
        { label: 'Assigned Date', value: formattedDate, icon: 'event' }
      ]
    }
  }

  getStatusClass(status: string): string {
    return status === 'available' ? 'status-available' : status === 'active' ? 'status-active' : ''
  }
}