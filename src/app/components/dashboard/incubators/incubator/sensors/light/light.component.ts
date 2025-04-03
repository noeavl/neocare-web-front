import { Component } from '@angular/core'
import { CardComponent } from '../../../../../shared/card/card.component'
import { DataSensorsService } from '../../../../../../services/data-sensors.service'
import { ActivatedRoute } from '@angular/router'
import { NgClass, NgIf } from '@angular/common'
import { MatSpinner } from '@angular/material/progress-spinner'
import { EchoService } from '../../../../../../services/echo-data-sensors.service'
import { MatIcon } from '@angular/material/icon'

@Component({
  selector: 'app-light',
  imports: [
    CardComponent,
    NgIf,
    MatSpinner,
    MatIcon,
    NgClass
  ],
  templateUrl: './light.component.html',
  styleUrl: './light.component.css'
})
export class LightComponent {
  id: number = 0
  lastData: any
  data: any
  dataLoaded: boolean = false

  constructor(
    private dataSensorsService: DataSensorsService, 
    private route: ActivatedRoute,
    private echoService: EchoService,
  ) { }

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      this.id = Number(params.get('id'))
      this.loadData(this.id)
      this.loadLatestData(this.id)
    })

    this.echoService.listen('my-channel', '.my-event', (data: any) => {
      this.loadData(this.id)
      this.loadLatestData(this.id)
    })
  }

  loadData (id: number) {
    this.dataSensorsService.index(id).subscribe((response) => {
      this.data = response.sensor_statistics.LDR
      this.dataLoaded = true
    }, (error) => {
      this.dataLoaded = true
    })
  }

  loadLatestData (id: number) {
    this.dataSensorsService.lastData(id).subscribe((response) => {
      this.lastData = response.LDR
      this.dataLoaded = true
    }, (error) => {
      this.dataLoaded = true
    })
  }

  getLightStatus(value: number): string {
    if (value > 800) return 'Bright'
    if (value >= 400) return 'Normal'
    return 'Dim'
  }

  getLightIcon(value: number): string {
    if (value > 800) return 'wb_sunny' 
    if (value >= 400) return 'brightness_7' 
    return 'brightness_3' 
  }
}
