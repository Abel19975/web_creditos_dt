import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';
import { AuthStore } from './auth-store';
import { Usuario } from './auth-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private http = inject(HttpClient);
  private auth = inject(AuthStore);

  async login(payload: { username: string; password: string }) {
    await firstValueFrom(
      this.http
        .post<{ message: string; user: Usuario }>(`${this.apiUrl}/login`, payload)
        .pipe(tap((res) => this.auth.guardarUsuario(res.user)))
    );
  }

  async logout() {
    this.auth.clear();
    await firstValueFrom(this.http.post(`${this.apiUrl}/logout`, {}));
  }
}
