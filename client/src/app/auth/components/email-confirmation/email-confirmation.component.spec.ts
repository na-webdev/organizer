import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { AuthServiceMock } from '../../services/mocks/auth-service.mock';

import { EmailConfirmationComponent } from './email-confirmation.component';

describe('EmailConfirmationComponent', () => {
  let component: EmailConfirmationComponent;
  let fixture: ComponentFixture<EmailConfirmationComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [EmailConfirmationComponent],
      providers: [{ provide: AuthService, useValue: AuthServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(EmailConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('confirms the user', () => {
    component.confirmUser('sdfjsdklfjsdklfjksdf');
    expect(authService.confirmUser).toHaveBeenCalled();
  });

  it('requests a new token', () => {
    component.requestNewToken('sdfjsdklfjsdklfjksdf');
    expect(authService.requestNewToken).toHaveBeenCalled();
  });

  it('sets error status', () => {
    component.setErrorStatus({ error: { message: 'Token expired' } });
    expect(component.status).toBe('expired');
    component.setErrorStatus({ error: { message: 'error' } });
    expect(component.status).toBe('error');
  });
});
