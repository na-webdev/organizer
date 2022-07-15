import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { UserMock } from './mocks/user.mock';
import { UserInterface } from '../types/user.interface';

const apiUrl = environment.apiUrl;

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: { navigate: jasmine.createSpy() } },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerMock = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('signs up user', () => {
    let responseMessage: string | undefined;
    const { username, email } = UserMock;
    const password = 'test';

    service.signUpUser(username, email, password).subscribe((res) => {
      responseMessage = res.message;
    });

    const req = httpMock.expectOne(apiUrl + 'users/sign-up');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'User created' });

    expect(responseMessage).toBe('User created');
  });

  it('signs in user', () => {
    let signInResponse: { token: string; user: UserInterface } | undefined;
    const { email } = UserMock;
    const password = 'test';

    service.signInUser(email, password).subscribe((res) => {
      signInResponse = res;
    });

    const req = httpMock.expectOne(apiUrl + 'users/sign-in');
    expect(req.request.method).toBe('POST');
    req.flush({
      token: 'test token',
      user: UserMock,
    });

    expect(signInResponse).toEqual({ token: 'test token', user: UserMock });
  });

  it('signs out user', () => {
    service.signOut();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/sign-in']);
  });

  it('requests user data', () => {
    let userData: UserInterface | undefined;
    service.getUserData().subscribe((res) => {
      userData = res;
    });
    service.requestUserData();
    const req = httpMock.expectOne(apiUrl + 'users/user-data');
    expect(req.request.method).toBe('GET');
    req.flush({ user: UserMock });

    expect(userData).toEqual(UserMock);
  });

  it('checks if user is signed in', () => {
    localStorage.setItem('token', 'test token');
    expect(service.isSignedIn()).toBeTruthy();
  });

  it('gets token', () => {
    localStorage.setItem('token', 'test token');
    expect(service.getToken()).toBe('test token');
  });

  it('confirms user', () => {
    let responseMessage: string | undefined;
    const token = 'test token';

    service.confirmUser(token).subscribe((res) => {
      responseMessage = res.message;
    });

    const req = httpMock.expectOne(apiUrl + 'users/confirm/' + token);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'User confirmed' });

    expect(responseMessage).toBe('User confirmed');
  });

  it('request new token', () => {
    let responseMessage: string | undefined;
    const token = 'test token';

    service.requestNewToken(token).subscribe((res) => {
      responseMessage = res.message;
    });

    const req = httpMock.expectOne(apiUrl + 'users/request-new-token');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'New token requested' });

    expect(responseMessage).toBe('New token requested');
  });
});
