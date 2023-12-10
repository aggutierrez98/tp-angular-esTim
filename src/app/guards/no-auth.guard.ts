import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

export const noAuthGuard: CanActivateFn = () => {

  const userService = inject(UsersService);
  const router = inject(Router);
  const currentUser = userService.getCurrentUser()

  if (currentUser) return router.navigate(['/']);
  return true;
};
