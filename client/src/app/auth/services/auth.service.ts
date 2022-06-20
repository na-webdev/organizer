import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signUpUser(username: string, email: string, password: string) {
    return this.http.post(apiUrl + 'users/sign-up', {
      username,
      email,
      password,
    });
  }
}
