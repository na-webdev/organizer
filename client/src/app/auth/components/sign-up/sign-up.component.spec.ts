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
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
