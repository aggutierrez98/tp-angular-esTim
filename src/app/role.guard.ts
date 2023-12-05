import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from './users.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const userService = inject(UsersService);
  const router = inject(Router);
  const currentUser = userService.getCurrentUser()

  if (currentUser && route.data['roles'].includes(currentUser.role)) return true;

  return router.navigate(['/']);
};
