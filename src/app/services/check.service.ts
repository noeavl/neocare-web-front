import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface indexFilters {
  hospital_id: number
  nurse_id: number
  baby_id: number
  incubator_id: number
  date1: string
  date2: string
}

@Injectable({
  providedIn: 'root'
})
export class CheckService {

  constructor(
    private http: HttpClient
  ) { }

  private URL = 'http://34.215.209.108/api/v1/checks'

  index(filters: indexFilters, page: number): Observable<any> {
    return this.http.get(`${this.URL}?page=${page}&hospital_id=${filters.hospital_id}&nurse_id=${filters.nurse_id}&baby_id=${filters.baby_id}&incubator_id=${filters.incubator_id}&date1=${filters.date1}&date2=${filters.date2}`)
  }
}
