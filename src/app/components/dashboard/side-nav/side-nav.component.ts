import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [
    {
      routeLink: '/dashboard',
      icon: '/recursos-web/dashboard-icon.png',
      label: 'Dashboard',
    },
    {
      routeLink: '/dashboard/addresses/list',
      icon: '/recursos-web/hospital-icon.png',
      label: 'Hospitals',
    },
    {
      routeLink: 'pages',
      icon: '/recursos-web/room-icon.png',
      label: 'Rooms',
    },
    {
      routeLink: 'settings',
      icon: '/recursos-web/incubator-icon.png',
      label: 'Incubators',
    },
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}