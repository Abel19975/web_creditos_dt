import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Caja } from './caja-interface';

@Injectable({
  providedIn: 'root',
})
export class CajaService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/caja/historial-arqueos`;

  async obtenerHistorialArqueos(parametros: {
    fecha_inicio: string;
    fecha_fin: string;
    empleado_id: number;
  }) {
    return await firstValueFrom(this.http.post<Caja[]>(`${this.url}`, parametros));
  }
}
