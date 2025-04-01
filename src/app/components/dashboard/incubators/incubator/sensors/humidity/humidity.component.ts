import { Component } from '@angular/core'
import { CardComponent } from '../../../../../shared/card/card.component'
import { DataSensorsService } from '../../../../../../services/data-sensors.service'
import { ActivatedRoute } from '@angular/router'
import { NgClass, NgIf } from '@angular/common'
import { MatSpinner } from '@angular/material/progress-spinner'
import { EchoService } from '../../../../../../services/echo-data-sensors.service'
import { MatIcon } from '@angular/material/icon'

@Component({
  selector: 'app-humidity',
  imports: [
    CardComponent,
    NgIf,
    MatSpinner,
    MatIcon,
    NgClass
],
  templateUrl: './humidity.component.html',
  styleUrl: './humidity.component.css'
})
export class HumidityComponent {
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
    // Obtiene el id de la ruta padre
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
      this.data = response.sensor_statistics.HAM
      this.dataLoaded = true
    }, (error) => {
      this.dataLoaded = true
    })
  }

  loadLatestData (id: number) {
    this.dataSensorsService.lastData(id).subscribe((response) => {
      this.lastData = response.HAM
      this.dataLoaded = true
    }, (error) => {
      this.dataLoaded = true
    })
  }

  getHumidityIcon(humidity: number) {
    if (humidity < 40) {
      return 'water_drop'
    } else if (humidity < 70) {
      return 'cloud'
    } else {
      return 'ac_unit'
    }
  }

  getHumidityStatus(humidity: number) {
    if (humidity < 40) {
      return 'Low'
    } else if (humidity < 70) {
      return 'Medium'
    } else {
      return 'High'
    }
  }
}
