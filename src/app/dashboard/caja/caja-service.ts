import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Caja } from './caja-interface';
import { Empleado } from '../../shared/interfaces/empleado';

@Injectable({
  providedIn: 'root',
})
export class CajaService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/caja`;

  async obtenerEmpleados() {
    return await firstValueFrom(
      this.http.get<{ data: Empleado[] }>(`${environment.apiUrl}/empleados`),
    );
  }

  async arquearCaja(empleadoId: number) {
    return await firstValueFrom(
      this.http.post<{ message: string }>(`${this.url}/arqueo`, { empleado_id: empleadoId }),
    );
  }

  async obtenerSaldosActualesEmpleados() {
    return await firstValueFrom(this.http.get<Caja[]>(`${this.url}/saldos-actuales-empleados`));
  }

  async obtenerHistorialArqueos(parametros: {
    fecha_inicio: string;
    fecha_fin: string;
    empleado_id: number | null;
  }) {
    return await firstValueFrom(
      this.http.post<Caja[]>(`${this.url}/historial-arqueos`, parametros),
    );
  }
}
