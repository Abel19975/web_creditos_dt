import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { withStorageSync } from '@angular-architects/ngrx-toolkit';

import { Usuario } from './auth-interface';
import { computed } from '@angular/core';

type AuthState = {
  usuario: Usuario | null;
};

const initialState: AuthState = {
  usuario: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withStorageSync({ key: 'usuario', autoSync: true }),

  withComputed((store) => ({
    isAuth: computed(() => !!store.usuario()),
  })),
  withMethods((store) => ({
    clear() {
      patchState(store, { usuario: null });
    },
    guardarUsuario(usuario: Usuario) {
      patchState(store, { usuario });
    },
  }))
);
