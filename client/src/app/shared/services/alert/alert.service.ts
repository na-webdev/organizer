import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../../modules/material/components/alert/alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private _snackBar: MatSnackBar) {}

  alertMessage(
    message: string,
    alertType: 'danger' | 'info' | 'success' = 'success',
    duration: number = 2500
  ): void {
    let snackBarRef = this._snackBar.openFromComponent(AlertComponent, {
      duration,
      data: { message },
      verticalPosition: 'top',
      panelClass: `snackbar-${alertType}`,
    });
  }
}
