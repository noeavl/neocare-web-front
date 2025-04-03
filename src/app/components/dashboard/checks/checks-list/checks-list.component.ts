import { Component, OnInit } from '@angular/core';
import { CheckService } from '../../../../services/check.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CheckCardComponent } from "./check-card/check-card.component";
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from "../../section-header/section-header.component";
import { MatPaginator } from '@angular/material/paginator';
import { MatSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-checks-list',
  imports: [
    CheckCardComponent, 
    CommonModule, 
    MatPaginator,
    MatSpinner
  ],
  templateUrl: './checks-list.component.html',
  styleUrl: './checks-list.component.css'
})
export class ChecksListComponent implements OnInit {

  constructor(
    private checksService: CheckService,
    private authService: AuthService
  ) { }

  formData: any = {}
  checks: any[] = []
  totalItems: number = 0
  pageSize: number = 6
  currentPage: number = 0
  dataLoaded: boolean = false

  form = new FormGroup({
    hospital_id: new FormControl(''),
    nurse_id: new FormControl(''),
    baby_id: new FormControl(''),
    incubator_id: new FormControl(''),
    date1: new FormControl(''),
    date2: new FormControl('')
  })

  ngOnInit(): void {

    this.cargarChecks(this.currentPage)
  }

  cargarChecks(page: number) {

    this.formData = {
      hospital_id: this.form.controls['hospital_id'].value,
      nurse_id: this.form.controls['nurse_id'].value,
      baby_id: this.form.controls['baby_id'].value,
      incubator_id: this.form.controls['incubator_id'].value,
      date1: this.form.controls['date1'].value,
      date2: this.form.controls['date2'].value
    }
    
    this.checksService.index(this.formData, this.currentPage + 1).subscribe(
      (response) => {
        this.checks = response.data.data
        this.totalItems = response.data.total
        this.currentPage = response.data.current_page - 1
        this.dataLoaded = true
      },
      (error) => {
        this.dataLoaded = true
        this.totalItems = 0
        this.currentPage = 0
      }
    )
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex
    this.cargarChecks(this.currentPage)
  }
}
