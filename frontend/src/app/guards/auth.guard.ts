import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.getCurrentUser();

  if (isAuthenticated) {
    return true; 
  } else { 
    console.error('Access denied - User not authenticated');
    return false;
  }
};
