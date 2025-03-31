import { Component } from '@angular/core'
import { CardComponent } from '../../../../../shared/card/card.component'
import { DataSensorsService } from '../../../../../../services/data-sensors.service'
import { ActivatedRoute } from '@angular/router'
import { NgIf } from '@angular/common'
import { MatSpinner } from '@angular/material/progress-spinner'
import { EchoService } from '../../../../../../services/echo-data-sensors.service'

@Component({
  selector: 'app-vibration',
  imports: [
    CardComponent,
    NgIf,
    MatSpinner
],
  templateUrl: './vibration.component.html',
  styleUrl: './vibration.component.css'
})
export class VibrationComponent {
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
      this.loadLatestData(this.id)
    })

    this.echoService.listen('my-channel', '.my-event', (data: any) => {
      console.log(data)
      this.loadLatestData(this.id)
    })
  }

  loadLatestData (id: number) {
    this.dataSensorsService.lastData(id).subscribe((response) => {
      console.log(response)
      this.lastData = response.VRB
      this.dataLoaded = true
    }, (error) => {
      console.log(error)
      this.dataLoaded = true
    })
  }
}
