import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  hide: boolean = true;

  signUpForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(16),
      Validators.pattern(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/
      ),
    ]),
  });

  constructor(
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.showErrorAlert = this.showErrorAlert.bind(this);
  }

  onSubmit(): void {
    const { username, email, password } = this.signUpForm.value;
    this.authService.signUpUser(username, email, password).subscribe((res) => {
      this.alertService.alertMessage(res.message, 'success');
      this.signUpForm.reset();
    }, this.showErrorAlert);
  }

  showErrorAlert(err: any) {
    this.alertService.alertMessage(err.error.message, 'danger');
  }

  getUsernameError(errorObj: ValidationErrors | null): string {
    if (errorObj?.['required']) return 'Username is required';
    if (errorObj?.['minlength'])
      return 'Username must be at least 3 characters';
    return '';
  }

  getEmailError(errorObj: ValidationErrors | null): string {
    if (errorObj?.['required']) return 'Email is required';
    if (errorObj?.['email']) return 'Email is invalid';
    return '';
  }

  getPasswordError(errorObj: ValidationErrors | null): string {
    if (errorObj?.['required']) return 'Password is required';
    if (errorObj?.['minlength'])
      return 'Password must be at least 6 characters';
    if (errorObj?.['maxlength'])
      return 'Password must be at most 16 characters';
    if (errorObj?.['pattern']) {
      if (!this.signUpForm.get('password')!.value.match(/[a-z]/))
        return 'Password must contain at least one lowercase letter';
      if (!this.signUpForm.get('password')!.value.match(/[A-Z]/))
        return 'Password must contain at least one uppercase letter';
      if (!this.signUpForm.get('password')!.value.match(/[0-9]/))
        return 'Password must contain at least one number';
      if (!this.signUpForm.get('password')!.value.match(/[^a-zA-Z0-9]/))
        return 'Password must contain at least one special character';
    }
    return '';
  }
}
