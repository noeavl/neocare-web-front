import { Component } from '@angular/core';
import { CardComponent } from "../../shared/card/card.component";
import { IconComponent } from '../../shared/icon/icon.component';
import { RouterLink } from '@angular/router';
import { routes } from '../../../app.routes';
@Component({
  selector: 'app-main-dashboard',
  imports: [
    CardComponent,
    IconComponent,
    RouterLink
],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent {

  directAccesses = [
    {
      img: '/recursos-web/address.png',
      title: 'Addresses',
      size: 90,
      route: '/dashboard/addresses/list'
    },
    {
      img: '/recursos-web/users-icon.png',
      title: 'Users',
      size: 90,
      routes: '/dashboard/users'
    },
    {
      img: '/recursos-web/checks-icon.png',
      title: 'Checks',
      size: 90,
      route: '/dashboard/checks'
    }
  ]
}
