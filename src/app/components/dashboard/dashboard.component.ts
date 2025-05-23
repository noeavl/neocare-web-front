import { Component, HostListener, OnInit, signal, NgModule } from '@angular/core'
import { SideNavComponent } from "./side-nav/side-nav.component"
import { CommonModule } from '@angular/common'
import { DashboardContentComponent } from "./dashboard-content/dashboard-content.component"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [
    SideNavComponent,
    CommonModule,
    DashboardContentComponent
  ]
})
export class DashboardComponent implements OnInit {
  isLeftSidebarCollapsed = signal<boolean>(false)
  screenWidth = signal<number>(window.innerWidth)

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth)
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true)
    }
  }

  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768)
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed)
  }
}
