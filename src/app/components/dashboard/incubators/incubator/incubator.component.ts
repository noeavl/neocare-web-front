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
    IncubatorDetailComponent,
    NgFor,
  ],
  templateUrl: './incubator.component.html',
  styleUrl: './incubator.component.css'
})
export class IncubatorComponent {
  id!: number
  dataLoaded: boolean = false
  incubator: any
  sensorsEntries: { label: string; state: any; icon: string, url: string }[] = []


  constructor(
    private route: ActivatedRoute,
    private incubatorsService: IncubatorsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'))
      this.loadIncubator(this.id)
    })
  }

  loadIncubator(id: number) {
    this.incubatorsService.show(id).subscribe(
        (response) => {
            console.log(response.incubator)
            this.incubator = response.incubator
            this.sensorsEntries = [
                { label: 'Temperature', state: this.incubator.temperature, icon: 'thermostat', url: 'temperature' },
                { label: 'Humidity', state: this.incubator.humidity, icon: 'humidity', url: 'humidity' },
                { label: 'Movement', state: this.incubator.co2, icon: 'movement', url: 'movement' },
                { label: 'Sound', state: this.incubator.co2, icon: 'sound', url: 'sound' },
                { label: 'Light', state: this.incubator.co2, icon: 'light', url: 'light' },
                { label: 'Vibration', state: this.incubator.co2, icon: 'vibration', url: 'vibration' }
            ];
            this.dataLoaded = true;
        },
        (error) => {
            console.log(error)
            this.dataLoaded = true
        }
    )
}
}