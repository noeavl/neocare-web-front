import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AddressService } from '../../../../services/address.service';
import { AddressCardComponent } from "./address-card/address-card.component";
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [
    AddressCardComponent,
    SectionHeaderComponent,
    MatPaginatorModule
  ],
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {
  addresses: any[] = [];
  totalItems: number = 0;
  pageSize: number = 8;
  currentPage: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(private addressService: AddressService) {}

  ngOnInit(): void {
    this.loadAddresses(this.currentPage);
  }

  loadAddresses(page: number): void {
    this.addressService.indexAddress(page + 1).subscribe(
      (response) => {
        console.log(response);
        this.addresses = response.data;
        this.totalItems = response.total; 
        this.currentPage = response.current_page - 1;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.loadAddresses(this.currentPage);
  }
}
