import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AddressService } from '../../../../services/address.service';
import { AddressCardComponent } from "./address-card/address-card.component";
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [
    AddressCardComponent,
    SectionHeaderComponent,
    MatPaginatorModule,
    RouterOutlet,
    ToastModule, 
    ButtonModule,
    RippleModule
  ],
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css'],
  providers: [
    MessageService
  ]
})
export class AddressListComponent implements OnInit {
  addresses: any[] = [];
  totalItems: number = 0;
  pageSize: number = 9;
  currentPage: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(
    private addressService: AddressService,
    private messageService: MessageService
  ) {}

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  ngOnInit(): void {
    this.loadAddresses(this.currentPage);
  }

  loadAddresses(page: number): void {
    this.addressService.indexAddress(page + 1).subscribe(
      (response) => {
        this.addresses = response.data
        this.totalItems = response.total
        this.currentPage = response.current_page - 1
      },
      (error) => {
        this.addresses = []
        this.totalItems = 0
        this.currentPage = 1
        this.showAlert('info', "Error", error.error.msg)
      }
    )
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex
    this.loadAddresses(this.currentPage)
  }
}
