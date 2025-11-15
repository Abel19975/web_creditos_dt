import { Component, computed, inject } from '@angular/core';
import { ToggleSidebar } from '../toggle-sidebar/toggle-sidebar';
import { ControlThemeComponent } from '../../control-theme/control-theme.component';
import { SidebarService } from '../sidebar/sidebar.service';
import { AuthService } from '../../../auth/auth-service';

@Component({
  selector: 'app-header',
  imports: [ControlThemeComponent, ToggleSidebar],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected sidebarSvc = inject(SidebarService);
  private authSvc = inject(AuthService);
}
