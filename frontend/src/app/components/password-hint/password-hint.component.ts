import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-password-hint',
  standalone: false,
  templateUrl: './password-hint.component.html',
  styleUrl: './password-hint.component.css'
})
export class PasswordHintComponent {
   forgotForm: FormGroup;
  statusMessage = '';

  constructor(private fb: FormBuilder,
     private http: HttpClient,
     private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.statusMessage = '';
  }

  onSubmit() {
    const email = this.forgotForm.value.email;
    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.statusMessage = 'Password hint sent if the account exists.';
      },
      error: (error) => {
        this.statusMessage = 'Error sending password hint: ' + error.message;
      }
    });
  }
}