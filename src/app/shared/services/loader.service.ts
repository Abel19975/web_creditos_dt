import { computed, Injectable, signal } from '@angular/core';

interface LoaderOptions {
  message: string;
  open: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loader = signal<LoaderOptions>({ message: 'Cargando...', open: false });

  options = computed(() => this.loader());

  present(message?: string) {
    this.loader.set({ open: true, message: message || '' });
  }

  close() {
    this.loader.set({ open: false, message: '' });
  }
}
