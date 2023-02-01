import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { AlertService } from '../../shared/services/alert/alert.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.loadingService.loadingOn();
    const token = this.authService.getToken();

    if (token) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),
      });

      return next.handle(cloned).pipe(
        catchError((err: any) => {
          if (err.status === 401) {
            this.authService.signOut();
            this.alertService.alertMessage('Session timeout', 'info');
          } else {
            this.alertService.alertMessage(err.error?.message, 'danger');
          }
          return throwError(err);
        }),
        finalize(() => this.loadingService.loadingOff())
      );
    }

    return next.handle(request);
  }
}
