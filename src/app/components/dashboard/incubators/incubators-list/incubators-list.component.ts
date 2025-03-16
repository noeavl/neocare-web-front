import { Component, OnInit, ViewChild } from '@angular/core'
import { IncubatorsService } from '../../../../services/incubators.service'
import { MatPaginator } from '@angular/material/paginator'
import { MessageService } from 'primeng/api'
import { IncubatorCardComponent } from './incubator-card/incubator-card.component'
import { NgFor, NgIf } from '@angular/common'
import { MatSpinner } from '@angular/material/progress-spinner'
import { SectionHeaderComponent } from '../../section-header/section-header.component'
import { ToastModule } from 'primeng/toast'

@Component({
  selector: 'app-incubators-list',
  standalone: true,
  imports: [
    IncubatorCardComponent, 
    NgFor, 
    ToastModule,
    MatSpinner, 
    SectionHeaderComponent, 
    MatPaginator
  ],
  templateUrl: './incubators-list.component.html',
  styleUrl: './incubators-list.component.css',
  providers: [MessageService]
})
export class IncubatorsListComponent implements OnInit {
  incubators: any [] = []
  totalItems: number = 0
  pageSize: number = 6
  currentPage: number = 0
  incubatorsLoaded: boolean = false

  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    private incubatorsService: IncubatorsService,
    private messageService: MessageService
  ) {}

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({severity: severity, summary: summary, detail: detail})
  }

  manageDeletion(event: any) {
    if (event.status === 404) {
      this.showAlert('error', 'Error', event.error.msg)
    } else {
      this.showAlert('succes', 'Success', event.msg)
    }
  }

  ngOnInit(): void {
    this.loadIncubators(this.currentPage)
  }

  loadIncubators(page: number): void {
    this.incubatorsService.index(page + 1).subscribe(
      (response) => {
        this.incubators = response.incubators.data
        this.totalItems = response.incubators.total
        this.currentPage = response.incubators.current_page - 1
        this.incubatorsLoaded = true
      },
      (error) => {
        console.log(error)
        this.incubators = []
        this.totalItems = 0
        this.currentPage = 0
        this.showAlert('info', 'Error', error.error.msg)
      }
    )
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex
    this.loadIncubators(this.currentPage)
  }
}