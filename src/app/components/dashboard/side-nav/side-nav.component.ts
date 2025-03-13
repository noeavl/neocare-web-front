import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit, OnChanges {
  @Input() isLeftSidebarCollapsed!: boolean;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();

  constructor(private authService: AuthService) { }
  showText: boolean = false;
  isMobile: boolean = false;

  items = [
    {
      routeLink: '/dashboard',
      icon: '/recursos-web/dashboard-icon.png',
      label: 'Dashboard',
    },
    {
      routeLink: '/dashboard/hospitals',
      icon: '/recursos-web/hospital-icon.png',
      label: 'Hospitals',
    },
    {
      routeLink: '/dashboard/rooms/list',
      icon: '/recursos-web/room-icon.png',
      label: 'Rooms',
    },
    {
      routeLink: '/dashboard/incubators/list',
      icon: '/recursos-web/incubator-icon.png',
      label: 'Incubators',
    },
    {
      routeLink: '/dashboard/babies/list',
      icon: '/recursos-web/baby-icon.png',
      label: 'Babies',
    },
    {
      routeLink: '/dashboard/relatives/list',
      icon: '/recursos-web/relatives-icon.png',
      label: 'Relatives',
    }
  ];

  ngOnInit(): void {
    this.checkScreenSize();
    this.showText = !this.isLeftSidebarCollapsed;
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isLeftSidebarCollapsed = true;
      this.showText = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLeftSidebarCollapsed']) {
      if (!this.isLeftSidebarCollapsed) {
        setTimeout(() => {
          this.showText = true;
        }, 500); // Delay the appearance of text by 500ms
      } else {
        this.showText = false;
      }
    }
  }

  toggleCollapse(): void {
    if (this.isMobile) return;

    const newState = !this.isLeftSidebarCollapsed;
    this.changeIsLeftSidebarCollapsed.emit(newState);
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

  logout() {

    this.authService.logout()
  }
}