import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  hide: boolean = true;

  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    // bind this to show alert function
    this.showErrorAlert = this.showErrorAlert.bind(this);
  }

  onSubmit(): void {
    const { email, password } = this.signInForm.value;
    this.authService.signInUser(email, password).subscribe((res) => {
      this.router.navigate(['/']);
      this.alertService.alertMessage(`Welcome ${res.user.username}!`, 'info');
      this.signInForm.reset();
    }, this.showErrorAlert);
  }

  getEmailError(errorObj: ValidationErrors | null): string {
    if (errorObj?.['required']) return 'Email is required';
    else if (errorObj?.['email']) return 'Email is invalid';
    return '';
  }

  getPasswordError(errorObj: ValidationErrors | null): string {
    if (errorObj?.['required']) return 'Password is required';
    return '';
  }

  showErrorAlert(error: any): void {
    this.alertService.alertMessage(error.error.message, 'danger');
  }
}
