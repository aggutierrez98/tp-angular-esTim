import { inject } from '@angular/core';
import { UsersService } from './users.service';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
    const userService = inject(UsersService);
    const router = inject(Router);
    const currentUser = userService.getCurrentUser()

    if (currentUser) return true;
    return router.navigate(['/auth/login']);
};
