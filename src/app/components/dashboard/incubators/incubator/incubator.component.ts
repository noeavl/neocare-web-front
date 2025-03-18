import { Component } from '@angular/core'
import { IncubatorsService } from '../../../../services/incubators.service'
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router'
import { MatSpinner } from '@angular/material/progress-spinner'
import { MatPaginator } from '@angular/material/paginator'
import { SectionHeaderComponent } from '../../section-header/section-header.component'
import { CardComponent } from '../../../shared/card/card.component'
import { Router } from '@angular/router'
import { IncubatorDetailComponent } from './incubator-detail/incubator-detail.component'
import { NgFor, NgIf } from '@angular/common'
import { MatIcon } from '@angular/material/icon'

@Component({
  selector: 'app-incubator',
  imports: [
    RouterLink,
    MatSpinner,
    SectionHeaderComponent,
    CardComponent,
    NgFor,
    RouterOutlet,
    MatIcon
  ],
  templateUrl: './incubator.component.html',
  styleUrl: './incubator.component.css'
})
export class IncubatorComponent {
  id!: number
  dataLoaded: boolean = false
  incubator: any
  sensorsEntries: { label: string; icon: string, url: string | null; }[] = []


  constructor(
    private route: ActivatedRoute,
    private incubatorsService: IncubatorsService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'))
      this.loadIncubator(this.id)
    })
  }

  loadIncubator(id: number) {
    this.incubatorsService.show(id).subscribe(
      (response) => {
        this.incubator = response.incubator
        this.sensorsEntries = [
          { label: 'Temperature', icon: 'thermostat', url: 'temperature' },
          { label: 'Humidity', icon: 'water_drop', url: 'humidity' },
          { label: 'Movement', icon: 'directions_run', url: 'movement' },
          { label: 'Sound', icon: 'graphic_eq', url: 'sound' },
          { label: 'Light', icon: 'light_mode', url: 'light' },
          { label: 'Vibration', icon: 'vibration', url: 'vibration' }
        ]
        this.dataLoaded = true
      },
      (error) => {
        console.log(error)
        this.dataLoaded = true
      }
    )
  }
}