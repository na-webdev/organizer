import { Injectable } from '@angular/core';
import { LoadingService } from '../loading/loading.service';
import { catchError, finalize, Observable, take, throwError } from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  apiUrl = environment.apiUrl;
  constructor(
    private loadingService: LoadingService,
    private alertService: AlertService,
    private http: HttpClient
  ) {}

  handleLoadingAndErrors<T>(observable: Observable<T>, unsubscribe = true) {
    this.loadingService.loadingOn();
    observable = observable.pipe(
      catchError((error) => {
        this.alertService.alertMessage(error.error.message, 'danger');
        return throwError(error);
      }),
      finalize(() => this.loadingService.loadingOff())
    );
    if (unsubscribe) observable = observable.pipe(take(1));
    return observable;
  }
}
