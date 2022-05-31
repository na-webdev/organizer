import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MenuItem } from '../../types/menu-item.interface';
import { menuItems } from './menu-item.config';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  isMenuOpen: boolean = true;
  darkTheme: boolean = false;

  menuItems: MenuItem[] = menuItems;
  contentMargin = 200;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onToolbarMenuToggle(): void {
    console.log('toolbar menu toggle', this.isMenuOpen);
    this.isMenuOpen = !this.isMenuOpen;
    this.contentMargin = this.isMenuOpen
      ? 200
      : this.mobileQuery.matches
      ? 0
      : 60;
  }

  toggleTheme(): void {
    if (!this.darkTheme) {
      this.renderer.removeClass(this.document.body, 'theme-light');
      this.renderer.addClass(this.document.body, 'theme-dark');
    } else {
      this.renderer.removeClass(this.document.body, 'theme-dark');
      this.renderer.addClass(this.document.body, 'theme-light');
    }
    this.darkTheme = !this.darkTheme;
  }
}
