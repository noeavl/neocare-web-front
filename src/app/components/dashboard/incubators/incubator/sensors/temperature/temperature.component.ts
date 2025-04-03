import { Component } from '@angular/core'
import { CardComponent } from '../../../../../shared/card/card.component'
import { DataSensorsService } from '../../../../../../services/data-sensors.service'
import { ActivatedRoute } from '@angular/router'
import { NgClass, NgIf } from '@angular/common'
import { MatSpinner } from '@angular/material/progress-spinner'
import { EchoService } from '../../../../../../services/echo-data-sensors.service'
import { Observable } from 'rxjs'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-temperature',
  imports: [
    CardComponent,
    NgIf,
    MatSpinner,
    MatIconModule,
    NgClass
  ],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.css'
})
export class TemperatureComponent {
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
      this.id = 1
      this.loadData(this.id)
      this.loadLatestData(this.id)
    })

    this.echoService.listen('my-channel', '.my-event', (data: any) => {
      this.loadData(this.id)
      this.loadLatestData(this.id)
    })
  }


  loadData(id: number) {
    this.dataSensorsService.index(id).subscribe((response) => {
      this.data = response.sensor_statistics.TAM
      this.dataLoaded = true
    }, (error) => {
      this.dataLoaded = true
    })
  }

  loadLatestData(id: number) {
    this.dataSensorsService.lastData(id).subscribe((response) => {
      this.lastData = response.TAM
      this.dataLoaded = true
    }, (error) => {
      this.dataLoaded = true
    })
  }

  getTemperatureIcon(value: number): string {
    if (value > 37) {
      return 'whatshot';
    } else if (value >= 35 && value <= 37) {
      return 'thermostat';
    } else if (value >= 20 && value < 35) {
      return 'check_circle';
    } else {
      return 'ac_unit';
    }
  }

  getTemperatureStatus(value: number): string {
    if (value >= 33) {
      return 'High Temperature';
    } else if (value >= 32 && value < 35) {
      return 'Normal Temperature';
    } else if (value <= 31 ) {
      return 'Low Temperature';
    } else {
      return 'Unknown Temperature';
    }
  }

}