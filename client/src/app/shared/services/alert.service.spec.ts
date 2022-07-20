import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AlertService } from './alert.service';
import { MatSnackBarMock } from './mocks/mat-snack-bar.mock';

describe('AlertService', () => {
  let service: AlertService;
  let snackBarMock: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatSnackBar,
          useValue: MatSnackBarMock,
        },
      ],
    });
    service = TestBed.inject(AlertService);
    snackBarMock = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call snackBar.openFromComponent', () => {
    const message = 'test';
    const alertType = 'success';
    const duration = 2500;
    service.alertMessage(message, alertType, duration);
    expect(snackBarMock.openFromComponent).toHaveBeenCalled();
  });
});
