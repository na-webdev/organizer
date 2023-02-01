import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatSnackBarMock } from 'src/app/shared/services/alert/mocks/mat-snack-bar.mock';

import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatSnackBar, useValue: MatSnackBarMock },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: { message: jasmine.createSpy() },
        },
      ],
    }).compileComponents();

    snackBar = TestBed.inject(MatSnackBar);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close alert', () => {
    component.closeAlert();
    expect(snackBar.dismiss).toHaveBeenCalled();
  });
});
