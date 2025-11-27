import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';
import { AuthStore } from './auth-store';
import { Usuario } from './auth-interface';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private http = inject(HttpClient);
  private auth = inject(AuthStore);
  private router = inject(Router);

  async login(payload: { username: string; password: string }) {
    await firstValueFrom(
      this.http
        .post<{ message: string; user: Usuario; token: string }>(`${this.apiUrl}/login`, payload)
        .pipe(
          tap((res) => {
            this.auth.guardarUsuario(res.user);
            this.auth.guardarToken(res.token);
          }),
        ),
    );
  }

  async logout() {
    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}/logout`, {}));
    } finally {
      this.auth.clear();
      this.router.navigate(['/auth/inicio-sesion'], { replaceUrl: true });
    }
  }
}
