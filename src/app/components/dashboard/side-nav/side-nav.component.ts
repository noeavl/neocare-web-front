import { CommonModule } from '@angular/common'
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, HostListener } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit, OnChanges {
  @Input() isLeftSidebarCollapsed!: boolean
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>()
  role: string = ''

  constructor(private authService: AuthService) { }
  showText: boolean = false
  isMobile: boolean = false

  // Todas las opciones posibles del menú
  allMenuItems = [
    {
      routeLink: '/dashboard',
      icon: '/recursos-web/dashboard-icon.png',
      label: 'Dashboard',
      roles: ['admin', 'super-admin', 'nurse', 'nurse-admin'] // Todos los roles pueden ver dashboard
    },
    {
      routeLink: '/dashboard/hospitals',
      icon: '/recursos-web/hospital-icon.png',
      label: 'Hospitals',
      roles: ['admin', 'super-admin'] // Solo admin y super-admin
    },
    {
      routeLink: '/dashboard/rooms/list',
      icon: '/recursos-web/room-icon.png',
      label: 'Rooms',
      roles: ['admin', 'super-admin', 'nurse', 'nurse-admin']
    },
    {
      routeLink: '/dashboard/incubators/list',
      icon: '/recursos-web/incubator-icon.png',
      label: 'Incubators',
      roles: ['admin', 'super-admin', 'nurse', 'nurse-admin']
    },
    {
      routeLink: '/dashboard/babies/list',
      icon: '/recursos-web/baby-icon.png',
      label: 'Babies',
      roles: ['admin', 'super-admin', 'nurse', 'nurse-admin']
    }
  ]

  filteredItems: any[] = []

  ngOnInit(): void {
    this.checkScreenSize()
    this.showText = !this.isLeftSidebarCollapsed

    this.authService.userRole().subscribe(
      (response) => {
        this.role = response.role
        this.filterMenuItems()
      },
      (error) => {

      }
    )
  }

  filterMenuItems(): void {
    this.filteredItems = this.allMenuItems.filter(item => 
      item.roles.includes(this.role)
    )
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize()
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768
    if (this.isMobile) {
      this.isLeftSidebarCollapsed = true
      this.showText = false
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLeftSidebarCollapsed']) {
      if (!this.isLeftSidebarCollapsed) {
        setTimeout(() => {
          this.showText = true
        }, 500)
      } else {
        this.showText = false
      }
    }
  }

  toggleCollapse(): void {
    if (this.isMobile) return

    const newState = !this.isLeftSidebarCollapsed
    this.changeIsLeftSidebarCollapsed.emit(newState)
  }

  trackByFn(index: number, item: any): number {
    return index
  }

  logout() {
    this.authService.logout()
  }
}