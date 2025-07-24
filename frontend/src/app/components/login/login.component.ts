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
      error: (err) => {
        console.error('Greška prilikom logina:', err.message);
        switch (err.status) {
          case 429:
            this.errorMessage = 'Previše prijava. Pokušajte ponovno kasnije';
            break;
          case 423:
              this.errorMessage = 'Račun je zaključan. Pokušajte ponovno kasnije';
              break;
          case 401:
            this.errorMessage = 'Neispravni podatci. Pokušajte ponovno.';
            break;
          default:
            this.errorMessage = 'Došlo je do greške. Pokušajte ponovno.';       
        }
      }
    });
    }
    else {
      console.log('Forma nije ispravna');
    }
  }

}
