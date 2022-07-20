import { MatDialog } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';

export const DialogProvider = {
  provide: MatDialog,
  useValue: {
    open: jasmine.createSpy().and.returnValue({ afterClosed: () => EMPTY }),
  },
};
