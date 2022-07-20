import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss'],
})
export class EmailConfirmationComponent implements OnInit {
  status: string = 'pending';
  token!: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token: string | null = this.route.snapshot.paramMap.get('token');
    this.confirmUser(token);
  }

  confirmUser(token: string | null): void {
    if (token)
      this.authService
        .confirmUser(token)
        .pipe(take(1))
        .subscribe((res) => {
          if (res.message === 'User confirmed') this.status = 'confirmed';
        }, this.setErrorStatus);
  }

  requestNewToken(token: string): void {
    this.authService
      .requestNewToken(token)
      .pipe(take(1))
      .subscribe((res) => {
        this.status = 'pending';
      }, this.setErrorStatus);
  }

  setErrorStatus(err: any): void {
    if (err.error.message === 'Token expired') this.status = 'expired';
    else this.status = 'error';
  }
}
