import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DataSensorsService {
  private URL = 'http://34.215.209.108/api/v1'

  constructor(private http: HttpClient) { }

  index(filters: number): Observable<any> {
    return this.http.get(`${this.URL}/sensor-data/${filters}`)
  }

  lastData(filters: number): Observable<any> {
    return this.http.get(`${this.URL}/latest-sensor-data/${filters}`)
  }
}
