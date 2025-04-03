import { Component } from '@angular/core'
import { CardComponent } from '../../../../../shared/card/card.component'
import { DataSensorsService } from '../../../../../../services/data-sensors.service'
import { ActivatedRoute } from '@angular/router'
import { NgIf } from '@angular/common'
import { MatSpinner } from '@angular/material/progress-spinner'
import { EchoService } from '../../../../../../services/echo-data-sensors.service'

@Component({
  selector: 'app-movement',
  imports: [
    CardComponent,
    NgIf,
    MatSpinner
],
  templateUrl: './movement.component.html',
  styleUrl: './movement.component.css'
})
export class MovementComponent {
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
      this.id = 1
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
      this.data = response.sensor_statistics.PRE
      this.dataLoaded = true
    }, (error) => {
      this.dataLoaded = true
    })
  }

  loadLatestData (id: number) {
    this.dataSensorsService.lastData(id).subscribe((response) => {
      this.lastData = response.PRE
      this.dataLoaded = true
    }, (error) => {
      this.dataLoaded = true
    })
  }
}
