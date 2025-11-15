import { Component, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/auth-service';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  public label = input('Panel Administrativo');

  public sidebarSvc = inject(SidebarService);
  private authSvc = inject(AuthService);

  logout() {
    this.authSvc.logout();
  }
}
