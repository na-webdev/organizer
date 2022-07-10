import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';
import { MenuItem } from '../../types/menu-item.interface';
import { menuItems } from './menu-item.config';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  isMenuOpen: boolean = false;
  darkTheme: boolean = localStorage.getItem('darkTheme') === 'true';

  menuItems: MenuItem[] = menuItems;
  contentMargin = 200;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private renderer: Renderer2
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.renderer.removeClass(
      this.document.body,
      this.darkTheme ? 'theme-light' : 'theme-dark'
    );
    this.renderer.addClass(
      this.document.body,
      this.darkTheme ? 'theme-dark' : 'theme-light'
    );
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onToolbarMenuToggle(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.contentMargin =
      this.isMenuOpen && !this.mobileQuery.matches
        ? 200
        : this.mobileQuery.matches
        ? 0
        : 60;
  }

  toggleTheme(): void {
    if (!this.darkTheme) {
      localStorage.setItem('darkTheme', 'true');
      this.renderer.removeClass(this.document.body, 'theme-light');
      this.renderer.addClass(this.document.body, 'theme-dark');
    } else {
      localStorage.setItem('darkTheme', 'false');
      this.renderer.removeClass(this.document.body, 'theme-dark');
      this.renderer.addClass(this.document.body, 'theme-light');
    }
    this.darkTheme = !this.darkTheme;
  }

  signOutUser() {
    this.authService.signOut();
  }
}
