import { withStorageSync } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { Usuario } from './auth-interface';
import { computed } from '@angular/core';

type AuthState = {
  usuario: Usuario | null;
  token: string;
};

const initialState: AuthState = {
  usuario: null,
  token: '',
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withStorageSync({ key: 'auth', autoSync: true }),

  withComputed((store) => ({
    isAuth: computed(() => !!store.token()),
  })),

  withMethods((store) => ({
    clear() {
      patchState(store, { token: '', usuario: null });
    },

    guardarUsuario(usuario: Usuario) {
      patchState(store, { usuario });
    },
    guardarToken(token: string) {
      patchState(store, { token });
    },
  })),
);
