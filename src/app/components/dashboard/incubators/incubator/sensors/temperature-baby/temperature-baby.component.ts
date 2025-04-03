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
  selector: 'app-temperature-baby',
  imports: [
    CardComponent,
    NgIf,
    MatSpinner,
    MatIconModule,
    NgClass
  ],
  templateUrl: './temperature-baby.component.html',
  styleUrl: './temperature-baby.component.css'
})
export class TemperatureBabyComponent {
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


  loadData(id: number) {
    this.dataSensorsService.index(id).subscribe((response) => {
      this.data = response.sensor_statistics.TBB
      this.dataLoaded = true
    }, (error) => {
      this.dataLoaded = true
    })
  }

  loadLatestData(id: number) {
    this.dataSensorsService.lastData(id).subscribe((response) => {
      this.lastData = response.TBB
      this.dataLoaded = true
    }, (error) => {
      this.dataLoaded = true
    })
  }

  getBackgroundColor(temp: number): string {
    if (temp >= 32) {
      return 'red'
    } else if (temp >= 25) {
      return 'yellow'
    } else if (temp >= 20) {
      return 'green'
    } else {
      return 'red'
    }
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
    if (value > 37) {
      return 'High Temperature';
    } else if (value >= 35 && value <= 37) {
      return 'Medium Temperature';
    } else if (value >= 20 && value < 35) {
      return 'Normal Temperature';
    } else {
      return 'Low Temperature';
    }
  }

}