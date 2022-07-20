import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AuthServiceMock } from 'src/app/auth/services/mocks/auth-service.mock';

import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LayoutComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: AuthService, useValue: AuthServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggles menu', () => {
    component.isMenuOpen = false;
    component.onToolbarMenuToggle();
    expect(component.isMenuOpen).toBeTruthy();
  });

  it('toggles light theme', () => {
    component.darkTheme = false;
    component.toggleTheme();
    expect(component.darkTheme).toBeTruthy();
  });

  it('toggles dark theme', () => {
    component.darkTheme = true;
    component.toggleTheme();
    expect(component.darkTheme).toBeFalsy();
  });

  it('signs out user', () => {
    component.signOutUser();
    expect(authService.signOut).toHaveBeenCalled();
  });
});
