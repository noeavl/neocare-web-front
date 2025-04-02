import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UsersManagementService } from '../services/users-management.service';
import { map, switchMap } from 'rxjs';

export const roleEditGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const usersService = inject(UsersManagementService);
  const router = inject(Router);
  const userId = route.params['id'];

  return authService.userRole().pipe(
    switchMap(currentUser => {
      // Si el usuario actual no es admin, permitir acceso
      if (currentUser.role !== 'admin') {
        return [true];
      }

      // Si es admin, verificar el rol del usuario a editar
      return usersService.getUserById(userId).pipe(
        map(userToEdit => {
          if (userToEdit.role === 'super-admin') {
            // Redirigir a la lista de usuarios si intenta editar un super-admin
            router.navigate(['/dashboard/users']);
            return false;
          }
          // Permitir edición si no es super-admin
          return true;
        })
      );
    })
  );
};