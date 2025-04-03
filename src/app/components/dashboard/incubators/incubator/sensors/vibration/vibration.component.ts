import { Component } from '@angular/core';
import { CardComponent } from '../../../../../shared/card/card.component';
import { DataSensorsService } from '../../../../../../services/data-sensors.service';
import { ActivatedRoute } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { MatSpinner } from '@angular/material/progress-spinner';
import { EchoService } from '../../../../../../services/echo-data-sensors.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-vibration',
  standalone: true,
  imports: [
    CardComponent,
    NgIf,
    MatSpinner,
    MatIconModule,
    NgClass
  ],
  templateUrl: './vibration.component.html',
  styleUrls: ['./vibration.component.css']
})
export class VibrationComponent {
  id: number = 0;
  lastData: any = null;
  dataLoaded: boolean = false;
  error: string | null = null;

  constructor(
    private dataSensorsService: DataSensorsService, 
    private route: ActivatedRoute,
    private echoService: EchoService,
  ) { }

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.loadLatestData(this.id);
    });

    this.echoService.listen('my-channel', '.my-event', (data: any) => {
      this.loadLatestData(this.id);
    });
  }

  loadLatestData(id: number) {
    this.dataLoaded = false;
    this.error = null;
    
    this.dataSensorsService.lastData(id).subscribe({
      next: (response) => {
        this.lastData = response.VRB || null;
        this.dataLoaded = true;
      },
      error: (error) => {
        console.error('Error loading vibration data:', error);
        this.error = 'Failed to load vibration data';
        this.lastData = null;
        this.dataLoaded = true;
      }
    });
  }

  getVibrationStatus(value: number): string {
    return value === 1 ? 'Vibration Detected' : 'No Vibration';
  }

  getVibrationIcon(value: number): string {
    return value === 1 ? 'warning' : 'check_circle';
  }

  getStatusColor(value: number): string {
    return value === 1 ? 'text-danger' : 'text-success';
  }
}