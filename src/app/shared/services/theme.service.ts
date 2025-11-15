import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeKey = 'theme';
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  private storedTheme = signal<'light' | 'dark' | 'system'>(this.loadStoredTheme());

  readonly isDarkMode = computed(() => {
    const theme = this.storedTheme();
    return theme === 'dark' || (theme === 'system' && this.mediaQuery.matches);
  });

  constructor() {
    effect(() => {
      const isDark = this.isDarkMode();
      document.documentElement.classList.toggle('dark', isDark);
    });

    this.mediaQuery.addEventListener('change', () => {
      const matches = this.mediaQuery.matches;
      this.setTheme(!matches ? 'light' : 'dark');
    });
  }

  private loadStoredTheme(): 'light' | 'dark' | 'system' {
    const stored = localStorage.getItem(this.themeKey);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  }

  setTheme(theme: 'light' | 'dark' | 'system') {
    if (theme === 'system') {
      localStorage.removeItem(this.themeKey);
    } else {
      localStorage.setItem(this.themeKey, theme);
    }
    this.storedTheme.set(theme);
  }

  toggleTheme() {
    const current = this.storedTheme();

    if (current === 'system') {
      this.setTheme(this.mediaQuery.matches ? 'light' : 'dark');
      return;
    }

    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }
}
