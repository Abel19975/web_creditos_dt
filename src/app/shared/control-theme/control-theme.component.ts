import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-control-theme',
  standalone: true,
  template: `
    <button
      (click)="themeSvc.toggleTheme()"
      class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none transition-colors cursor-pointer"
      aria-label="Toggle Theme"
    >
      @if (themeSvc.isDarkMode()) {
        <i class="pi pi-sun text-xl"></i>
      } @else {
        <i class="pi pi-moon text-xl"></i>
      }
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlThemeComponent {
  themeSvc = inject(ThemeService);
}
