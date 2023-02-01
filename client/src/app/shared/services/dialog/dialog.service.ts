import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../modules/global-components/components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmation(
    title: string,
    message: string,
    actionText?: string,
    config?: MatDialogConfig
  ) {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title,
          message,
          actionText,
        },
        ...(config || {}),
      })
      .afterClosed();
  }

  openCustomDialog(component: any, data: any, config: MatDialogConfig) {
    return this.dialog.open(component, { data, ...config }).afterClosed();
  }
}
