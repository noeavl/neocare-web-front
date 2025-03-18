import { Component, HostListener, OnInit, signal } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table'; 
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'app-user-managements',
  standalone: true,
  imports: [CommonModule, SideNavComponent, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './user-managements.component.html',
  styleUrl: './user-managements.component.css'
})
export class UserManagementsComponent implements OnInit{
    isLeftSidebarCollapsed = signal<boolean>(false);
    screenWidth = signal<number>(window.innerWidth);

    displayedColumns: string[] = ['name', 'email', 'accion'];
    dataSource = [

    ];

      @HostListener('window:resize')
      onResize() {
        this.screenWidth.set(window.innerWidth);
        if (this.screenWidth() < 768) {
          this.isLeftSidebarCollapsed.set(true);
        }
      }
    
      ngOnInit(): void {
        this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
      }
    
      changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
        this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
      }

  editarUsuario(usuario: any): void {
    console.log('Editar usuario:', usuario);
  }

}
