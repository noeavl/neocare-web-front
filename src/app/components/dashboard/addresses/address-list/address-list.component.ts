import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AddressService } from '../../../../services/address.service';
import { AddressCardComponent } from "./address-card/address-card.component";
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [
    AddressCardComponent,
    SectionHeaderComponent,
    MatPaginatorModule,
    ToastModule, 
    ButtonModule,
    RippleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css'],
  providers: [
    MessageService
  ]
})
export class AddressListComponent implements OnInit {
  addresses: any[] = []
  totalItems: number = 0
  pageSize: number = 9
  currentPage: number = 0
  addressesLoaded: boolean = false

  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(
    private addressService: AddressService,
    private messageService: MessageService
  ) {}

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  manageDeletion(event: any) {
    if (event.status == 404) {
      this.showAlert('error', 'Error', event.error.msg)
    } else {
      this.showAlert('success', 'Success', event.msg)
    }
  }

  ngOnInit(): void {
    this.loadAddresses(this.currentPage);
  }

  loadAddresses(page: number): void {
    this.addressService.indexAddress(page + 1).subscribe(
      (response) => {
        this.addresses = response.addresses.data
        this.totalItems = response.addresses.total
        this.currentPage = response.addresses.current_page - 1
        this.addressesLoaded = true
      },
      (error) => {
        console.log(error)
        this.addresses = []
        this.totalItems = 0
        this.currentPage = 0
        this.showAlert('info', "Error", error.error.msg)
      }
    )
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex
    this.loadAddresses(this.currentPage)
  }
}
