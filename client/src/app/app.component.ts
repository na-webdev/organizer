import { Component } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { LoadingService } from './shared/services/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    public loadingService: LoadingService
  ) {
    this.authService.requestUserData();
  }
}
