import { CanActivateFn } from '@angular/router'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { map, catchError } from 'rxjs/operators'
import { of } from 'rxjs'

export const nurseAdminCheckGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  return authService.userRole().pipe(
    map((response: any) => {
      if (response.role !== 'nurse-admin' && response.role !== 'nurse') {
        return true
      } else {
        router.navigate(['/dashboard'])
        return false
      }
    }),
    catchError((error) => {
      router.navigate(['/'])
      return of(false)
    })
  )
}