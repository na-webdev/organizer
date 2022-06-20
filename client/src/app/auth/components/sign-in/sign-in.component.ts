import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  hide: boolean = true;

  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor() {}

  ngOnInit(): void {}

  onSubmit(): void {
    console.log(this.signInForm.value);
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
