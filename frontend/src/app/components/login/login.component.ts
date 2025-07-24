import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  loginForm: FormGroup;
  errorMessage: string = '';
  captchaToken : string | null = null;
  showCaptcha = false;
  failedAttempts = 0;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      masterPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.get('email')?.value,
        masterPassword: this.loginForm.get('masterPassword')?.value,
    }
    this.errorMessage = '';
    this.authService.login(loginData).pipe(
    ).subscribe({
      next: (response: any) => {
        console.log('Login uspješan:', response);
        this.router.navigateByUrl('/vault');
      },
      error: (error) => {
        console.error('Greška prilikom logina:', error.message);
        if(error.status === 429) {
          this.errorMessage = 'Previše pokušaja prijave. Pokušajte ponovno za 3 minute.';
        }
      }
    });
    }
    else {
      console.log('Forma nije ispravna');
    }
  }

  onCaptchaResolved(token: string | null): void {
    this.captchaToken = token;
  }

}
