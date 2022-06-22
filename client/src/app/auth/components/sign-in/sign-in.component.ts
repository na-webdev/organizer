import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  hide: boolean = true;

  signInForm: FormGroup = new FormGroup({
    email: new FormControl('nurmatovrahimjon@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('123456', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    console.log(this.signInForm.value);
    const { email, password } = this.signInForm.value;
    this.authService.signInUser(email, password).subscribe(
      (res) => {
        this.router.navigate(['/']);
        this.alertService.alertMessage(`Welcome ${res.user.username}!`, 'info');
      },
      (err) => {
        this.alertService.alertMessage(err.error.message, 'danger');
      }
    );
  }

  getEmailError(): string {
    const errorObj = this.signInForm.get('email')!.errors;
    if (errorObj?.['required']) return 'Email is required';
    if (errorObj?.['email']) return 'Email is invalid';
    return '';
  }

  getPasswordError(): string {
    const errorObj = this.signInForm.get('password')!.errors;
    if (errorObj?.['required']) return 'Password is required';
    if (errorObj?.['minlength'])
      return 'Password must be at least 6 characters';
    return '';
  }
}
