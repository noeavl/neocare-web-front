import { Component } from '@angular/core'
import { CardComponent } from '../../../shared/card/card.component'
import { IconComponent } from '../../../shared/icon/icon.component'
import { MatIconModule } from '@angular/material/icon'
import { BabiesService } from '../../../../services/babies.service'
import { RelativesService } from '../../../../services/relatives.service'
import { MessageService } from 'primeng/api'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { ToastModule } from 'primeng/toast'
import { CommonModule } from '@angular/common'
import { NgxPaginationModule } from 'ngx-pagination'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { SectionHeaderComponent } from '../../section-header/section-header.component'
import { BabyRelativeCardComponent } from './baby-relative-card/baby-relative-card.component'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { Router } from '@angular/router'

@Component({
  selector: 'app-babies-detail',
  imports: [
    IconComponent, 
    MatIconModule, 
    ToastModule, 
    CommonModule, 
    NgxPaginationModule, 
    MatProgressSpinner, 
    SectionHeaderComponent, 
    MatPaginatorModule,
    CardComponent, 
    BabyRelativeCardComponent,
    RouterLink
  ],
  templateUrl: './babies-detail.component.html',
  styleUrl: './babies-detail.component.css',
  providers: [MessageService]
})
export class BabiesDetailComponent {
  page: number = 1 
  dataLoaded: boolean = false
  baby!: Baby
  id: number
  // relatives: Relative[] = []
  relatives: any[] = []
  totalItems = 0
  pageSize = 4
  currentPage = 1
  constructor(
    private babiesService: BabiesService, 
    private relativesService: RelativesService, 
    private messageService: MessageService, 
    private route: ActivatedRoute,
    private router: Router // Añadir Router a los imports e inyectarlo
  ) {
    this.id = this.route.snapshot.params['id']
  }
  ngOnInit() {
    this.getBaby()
    this.getRelatives(this.currentPage)

  }
  getBaby() {
    this.dataLoaded = false
    this.babiesService.show(this.id).subscribe({
      next: (response) => {
        this.baby = response.baby
        this.dataLoaded = true
      },
      error: (error) => {
        this.dataLoaded = true
        this.showAlert('error', 'Error', error.error.message)
      } 
    })
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 })
  }

  getRelatives(page: number) {
    this.relativesService.indexWithRelatives(page, this.id).subscribe({
      next: (response) => {
        this.relatives = response.relatives.data
        this.totalItems = response.relatives.total 
        this.currentPage = response.relatives.current_page
      },
      error: (error) => 
      {
      }
    })
  }
  
  changePage(event: PageEvent) {
    this.currentPage = event.pageIndex + 1 
    this.pageSize = event.pageSize
    this.getRelatives(this.currentPage)
  }

  alertDelete(id: number) {
    this.relativesService.delete(id).subscribe({
      next: (response) => {
        this.showAlert('success', 'Success', 'Relative deleted successfully');
        this.getRelatives(this.currentPage)
      },
      error: (error) => {
        this.showAlert('error', 'Error', error.error.message);
      }
    });
  }
}

interface Baby {
  id: number,
  date_of_birth: Date,
  created_at: Date,
  person:{
    name: string,
    last_name_1: string,
    last_name_2: string
  },
  hospital: {
    name: string
  },
  baby_incubator: BabyIncubator[]
  relative: Relative[]
} 
interface Relative{
  id: number
  email: string,
  phone_number: string,
  person: {
    name: string,
    last_name_1: string,
    last_name_2: string
  }
}

interface BabyIncubator {
  id: number
  incubator: {
    room_id: number
  }
}