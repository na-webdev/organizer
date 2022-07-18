import { HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { AuthServiceMock } from '../services/mocks/auth-service.mock';
import { AuthInterceptor } from './auth.interceptor';
import { environment } from 'src/environments/environment';

const apiUrl = environment.apiUrl;

describe('AuthInterceptor', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let interceptor: AuthInterceptor;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptor,
        { provide: AuthService, useValue: AuthServiceMock },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    })
  );

  beforeEach(() => {
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(AuthInterceptor);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
