import { Component } from '@angular/core'
import { IncubatorDetailComponent } from '../incubator-detail/incubator-detail.component'
import { ActivatedRoute } from '@angular/router'
import { IncubatorsService } from '../../../../../services/incubators.service'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { MatSpinner } from '@angular/material/progress-spinner'
import { MatPaginator } from '@angular/material/paginator'

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    IncubatorDetailComponent,
    SweetAlert2Module,
    ToastModule,
    MatSpinner
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
  providers: [MessageService]
})
export class DetailComponent {
  incubator: any
  dataLoaded: boolean = false

  constructor(
    private router: ActivatedRoute, 
    private incubatorsService: IncubatorsService, 
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.incubatorsService.show(this.router.snapshot.params['id']).subscribe(
      (response) => {
        console.log(response)
        this.incubator = response.incubator
        this.dataLoaded = true
      },
      (error) => {
        this.showAlert("error", "Error", "Could not load incubator data.")
        this.dataLoaded = true
      }
    )
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail })
  }

}