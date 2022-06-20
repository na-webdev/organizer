import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserInterface } from '../types/user.interface';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData = new BehaviorSubject<UserInterface>({
    _id: '',
    username: '',
    email: '',
  });
  token = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  signUpUser(
    username: string,
    email: string,
    password: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(apiUrl + 'users/sign-up', {
      username,
      email,
      password,
    });
  }

  signInUser(
    email: string,
    password: string
  ): Observable<{ token: string; user: UserInterface }> {
    return this.http
      .post<{ token: string; user: UserInterface }>(apiUrl + 'users/sign-in', {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          this.userData.next(res.user);
          this.token.next(res.token);
        })
      );
  }

  confirmUser(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(
      apiUrl + 'users/confirm/' + token
    );
  }

  requestNewToken(token: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      apiUrl + 'users/request-new-token',
      { token }
    );
  }
}
