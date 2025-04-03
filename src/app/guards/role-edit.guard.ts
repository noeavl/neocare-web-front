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

  return usersService.getUserById(userId).pipe(
    map(userToEdit => {
      // Bloquear edición si el usuario a editar es super-admin
      if (userToEdit.role === 'super-admin') {
        router.navigate(['/dashboard/users']);
        return false;
      }
      
      // Permitir edición para otros roles
      return true;
    })
  );
};