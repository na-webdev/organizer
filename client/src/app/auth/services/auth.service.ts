import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
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

  constructor(private http: HttpClient, private router: Router) {}

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
          this.setSession(res.token, res.user);
        })
      );
  }

  signOut(): void {
    this.userData.next({
      _id: '',
      username: '',
      email: '',
    });
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }

  private setSession(token: string, user: UserInterface): void {
    this.userData.next(user);
    localStorage.setItem('token', token);
  }

  requestUserData(): void {
    this.http
      .get<{ user: UserInterface }>(apiUrl + 'users/user-data')
      .subscribe((res) => {
        this.userData.next(res.user);
      });
  }

  isSignedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
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
