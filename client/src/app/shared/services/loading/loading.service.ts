import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  take,
  throwError,
} from 'rxjs';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loading = this.loadingSubject.asObservable();
  constructor(private alertService: AlertService) {}

  isLoading(): Observable<boolean> {
    return this.loading;
  }

  loadingOn(): void {
    this.loadingSubject.next(true);
  }

  loadingOff(): void {
    this.loadingSubject.next(false);
  }

  requestObservableHandler<T>(observable: Observable<T>, unsubscribe = true) {
    this.loadingOn();
    observable = observable.pipe(
      catchError((error) => {
        this.alertService.alertMessage(error.error.message, 'danger');
        return throwError(error);
      }),
      finalize(() => this.loadingOff())
    );
    if (unsubscribe) observable = observable.pipe(take(1));
    return observable;
  }
}
