import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AlertServiceMock } from 'src/app/shared/services/mocks/alert-service.mock';
import { AuthService } from '../../services/auth.service';
import { AuthServiceMock } from '../../services/mocks/auth-service.mock';

import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let alertService: AlertService;
  let authService: AuthService;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule],
      declarations: [SignInComponent],
      providers: [
        { provide: AuthService, useValue: AuthServiceMock },
        { provide: AlertService, useValue: AlertServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    alertService = TestBed.inject(AlertService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submits the form', () => {
    component.signInForm.controls['email'].setValue('nur@gmail.com');
    component.signInForm.controls['password'].setValue('123456');
    component.onSubmit();
    expect(authService.signInUser).toHaveBeenCalled();
  });

  it('shows error alert', () => {
    component.showErrorAlert({ error: { message: 'error' } });
    expect(alertService.alertMessage).toHaveBeenCalled();
  });

  it('shows email is required error', () => {
    component.signInForm.controls['email'].setValue('do');
    component.signInForm.controls['password'].setValue('123456');
    component.onSubmit();
    expect(alertService.alertMessage).toHaveBeenCalled();
    expect(component.getEmailError({ email: true })).toBe('Email is invalid');
  });

  it('shows no error for email and password field', () => {
    component.signInForm.controls['email'].setValue('my@gmail.com');
    component.signInForm.controls['password'].setValue('123456');
    component.onSubmit();

    expect(component.getEmailError(null)).toBe('');
    expect(component.getPasswordError(null)).toBe('');
  });
});
