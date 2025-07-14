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

    this.authService.login(loginData).pipe(
    ).subscribe({
      next: (response: any) => {
        console.log('Login uspješan:', response);
        //localStorage.setItem('token', response.token);
        //localStorage.setItem('user', JSON.stringify(response.user));
        //this.userService.setUser(response.user);
        console.log('Korisnik spremljen:', response.user);
        this.router.navigateByUrl('/vault');
      },
      error: (error) => {
        console.error('Greška prilikom logina:', error);

      }
    });
    }
    else {
      console.log('Forma nije ispravna');
    }
  }
}
