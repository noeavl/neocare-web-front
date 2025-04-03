import { Component } from '@angular/core'
import { CardComponent } from '../../../../../shared/card/card.component'
import { DataSensorsService } from '../../../../../../services/data-sensors.service'
import { ActivatedRoute } from '@angular/router'
import { NgClass, NgIf } from '@angular/common'
import { MatSpinner } from '@angular/material/progress-spinner'
import { EchoService } from '../../../../../../services/echo-data-sensors.service'
import { MatIcon } from '@angular/material/icon'

@Component({
  selector: 'app-sound',
  imports: [
    CardComponent,
    NgIf,
    MatSpinner,
    NgClass,
    MatIcon
],
  templateUrl: './sound.component.html',
  styleUrl: './sound.component.css'
})
export class SoundComponent {
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
      this.data = response.sensor_statistics.SON
      this.dataLoaded = true
    }, (error) => {
      this.dataLoaded = true
    })
  }

  loadLatestData (id: number) {
    this.dataSensorsService.lastData(id).subscribe((response) => {
      this.lastData = response.SON
      this.dataLoaded = true
    }, (error) => {
      this.dataLoaded = true
    })
  }

  getSoundStatus(value: number): string {
    if (value > 85) return 'Dangerous';
    if (value >= 60) return 'Loud';
    if (value >= 30) return 'Moderate';
    return 'Quiet';
  }

  getSoundIcon(value: number): string {
    if (value > 85) return 'warning';
    if (value >= 60) return 'volume_up';
    if (value >= 30) return 'volume_down';
    return 'volume_mute';
  }
}