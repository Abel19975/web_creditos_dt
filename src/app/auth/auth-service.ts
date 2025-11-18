import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';
import { AuthStore } from './auth-store';
import { Usuario } from './auth-interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private http = inject(HttpClient);
  private auth = inject(AuthStore);
  private router = inject(Router);

  async login(payload: { username: string; password: string }) {
    await firstValueFrom(
      this.http
        .post<{ message: string; user: Usuario }>(`${this.apiUrl}/login`, payload)
        .pipe(tap((res) => this.auth.guardarUsuario(res.user))),
    );
  }

  async logout() {
    this.auth.clear();
    this.router.navigate(['/auth/inicio-sesion'], { replaceUrl: true });
    await firstValueFrom(this.http.post(`${this.apiUrl}/logout`, {}));
  }
}
