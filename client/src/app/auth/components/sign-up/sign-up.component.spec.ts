import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AlertServiceMock } from 'src/app/shared/services/mocks/alert-service.mock';
import { AuthService } from '../../services/auth.service';
import { AuthServiceMock } from '../../services/mocks/auth-service.mock';

import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let alertService: AlertService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [SignUpComponent],
      providers: [
        { provide: AuthService, useValue: AuthServiceMock },
        {
          provide: AlertService,
          useValue: AlertServiceMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    alertService = TestBed.inject(AlertService);
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('signs up user', () => {
    const { username, email, password } = component.signUpForm.value;
    component.onSubmit();
    expect(authService.signUpUser).toHaveBeenCalledWith(
      username,
      email,
      password
    );
  });

  it('shows email error', () => {
    expect(component.getEmailError({ email: true })).toBe('Email is invalid');
    expect(component.getEmailError(null)).toBe('');
  });

  it('shows username error', () => {
    expect(component.getUsernameError({ required: true })).toBe(
      'Username is required'
    );
    expect(component.getUsernameError({ minlength: true })).toBe(
      'Username must be at least 3 characters'
    );
    expect(component.getUsernameError(null)).toBe('');
  });

  it('shows password error', () => {
    expect(component.getPasswordError({ required: true })).toBe(
      'Password is required'
    );
    expect(component.getPasswordError({ minlength: true })).toBe(
      'Password must be at least 6 characters'
    );
    expect(component.getPasswordError({ maxlength: true })).toBe(
      'Password must be at most 16 characters'
    );
    expect(component.getPasswordError({ pattern: true })).toBe(
      'Password must contain at least one lowercase letter'
    );
    expect(component.getPasswordError(null)).toBe('');
  });

  it('shows error alert', () => {
    const error = { error: { message: 'Error' } };
    component.showErrorAlert(error);
    expect(alertService.alertMessage).toHaveBeenCalledWith('Error', 'danger');
  });
});
