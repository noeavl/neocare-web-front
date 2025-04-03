import { Component, OnInit, OnDestroy } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false
  rol: string = ''
  private authSubscription!: Subscription

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authStatus$.subscribe(status => {
      this.isAuthenticated = status.isAuthenticated
      this.rol = status.role
    })
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe()
    }
  }

  logout() {
    this.authService.logout().subscribe({
      error: (error) => {
        console.error('Error al cerrar sesión:', error)
      }
    })
  }
}