import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
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
    ]),
  });

  constructor() {}

  ngOnInit(): void {}

  onSubmit(): void {
    console.log(this.signUpForm.value);
  }

  getUsernameError(): string {
    const errorObj = this.signUpForm.get('username')!.errors;
    if (errorObj?.['required']) return 'Username is required';
    if (errorObj?.['minlength'])
      return 'Username must be at least 3 characters';
    return '';
  }

  getEmailError(): string {
    const errorObj = this.signUpForm.get('email')!.errors;
    if (errorObj?.['required']) return 'Email is required';
    if (errorObj?.['email']) return 'Email is invalid';
    return '';
  }

  getPasswordError(): string {
    const errorObj = this.signUpForm.get('password')!.errors;
    if (errorObj?.['required']) return 'Password is required';
    if (errorObj?.['minlength'])
      return 'Password must be at least 6 characters';
    return '';
  }
}
