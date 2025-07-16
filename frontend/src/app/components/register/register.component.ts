import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterData } from '../../models/RegisterData';
import { NavigationComponent } from '../partials/navigation/navigation.component';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  //imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterComponent {
  
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      masterPassword: ['', [Validators.required, Validators.minLength(12)]],
      repeatMasterPassword: ['', [Validators.required]],
      masterHint: ['', [Validators.maxLength(100)]]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup) {
    const pass = group.get('masterPassword')?.value;
    const repeat = group.get('repeatMasterPassword')?.value;
    return pass === repeat ? null : { passwordsNotMatching: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const registerData : RegisterData = {
        email: this.registerForm.get('email')?.value,
        masterPassword: this.registerForm.get('masterPassword')?.value,
        note: this.registerForm.get('masterHint')?.value || ''
      }

      this.authService.register(registerData).pipe(
      ).subscribe({
        next: (response) => {
          console.log('Registracija uspješna:', response);
        },
        error: (error) => {
          console.error('Greška prilikom registracije:', error);
        }
      });
    }
    else {
      console.log('Forma nije ispravna');
    }
  }
}
