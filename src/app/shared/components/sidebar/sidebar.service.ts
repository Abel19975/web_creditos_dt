import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../auth/auth-service';

export interface MenuItem {
  label: string;
  icon: string;
  link?: string;
  children?: MenuItem[];
  permission?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private authSvc = inject(AuthService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  private _isOpen = signal(false);
  private _isHovering = signal(false);
  private _openSubmenus = signal<Set<string>>(new Set());
  private _menuItems = signal<MenuItem[]>([]);
  private _isMobile = signal(false);

  public isOpen = this._isOpen.asReadonly();
  public isHovering = this._isHovering.asReadonly();
  public openSubmenus = this._openSubmenus.asReadonly();
  public menuItems = this._menuItems.asReadonly();
  public isMobile = this._isMobile.asReadonly();

  public isExpanded = computed(() => this.isOpen() || this.isHovering());

  constructor() {
    this.cargarMenu();
    this._observeBreakpoints();
    this._observeRouterEvents();
    this._setupEffects();
  }

  public toggleSidebar(): void {
    this._isOpen.update((value) => !value);
    if (this.isOpen()) {
      this._isHovering.set(false);
    }
  }

  public closeOnMobile(): void {
    if (this.isMobile()) {
      this._isOpen.set(false);
      this._isHovering.set(false);
    }
  }

  public toggleSubmenu(label: string): void {
    if (!this.isExpanded()) return;
    this._openSubmenus.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  }

  public setHovering(isHovering: boolean): void {
    if (!this.isOpen()) {
      this._isHovering.set(isHovering);
      if (!isHovering) {
        this._openSubmenus.set(new Set());
      }
    }
  }

  private async cargarMenu() {
    const menuItems: MenuItem[] = [];
    menuItems.push({
      label: 'Dashboard',
      icon: 'pi-objects-column',
      link: '/principal',
    });
    menuItems.push({
      label: 'Empleados',
      icon: 'pi-users',
      link: '/empleados',
    });
    menuItems.push({
      label: 'Créditos',
      icon: 'pi-list',
      link: '/creditos',
    });
    menuItems.push({
      label: 'Caja',
      icon: 'pi-wallet',
      link: '/caja',
    });
    this._menuItems.set(menuItems);
  }

  private _observeBreakpoints() {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe((result) => {
      this._isMobile.set(result.matches);
      this._isOpen.set(!result.matches);
    });
  }

  private _observeRouterEvents() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const currentUrl = (event as NavigationEnd).urlAfterRedirects;
        this._autoOpenSubmenu(currentUrl);
        this.closeOnMobile();
      });
  }

  private _autoOpenSubmenu(currentUrl: string) {
    if (this.isOpen()) {
      const activeMenuItem = this.menuItems().find((item) =>
        item.children?.some((child) => currentUrl.includes(child.link!)),
      );

      if (activeMenuItem && !this.openSubmenus().has(activeMenuItem.label)) {
        this._openSubmenus.update((set) => {
          const newSet = new Set(set);
          newSet.add(activeMenuItem.label);
          return newSet;
        });
      }
    }
  }

  private _setupEffects() {}
}
