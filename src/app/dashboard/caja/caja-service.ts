import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom, map } from 'rxjs';
import { Caja, CarteraResponse, Movimientos, TotalCaja } from './caja-interface';
import { Empleado } from '../empleados/empleado-interface';

@Injectable({
  providedIn: 'root',
})
export class CajaService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/caja`;

  async registrarEgreso(datos: { monto: number; empleado_id: number; descripcion: string | null }) {
    return await firstValueFrom(
      this.http.post<{ message: string }>(`${this.url}/registrar-egreso`, datos),
    );
  }

  async obtenerEmpleados() {
    return await firstValueFrom(
      this.http.get<{ data: Empleado[] }>(`${environment.apiUrl}/empleados`),
    );
  }

  async arquearCaja(empleadoId: number) {
    return await firstValueFrom(
      this.http.post<{ resumen: any }>(`${this.url}/arqueo`, { empleado_id: empleadoId }).pipe(
        map((res) => {
          return res.resumen.mensaje;
        }),
      ),
    );
  }

  async obtenerSaldosActualesEmpleados() {
    return await firstValueFrom(this.http.get<Caja[]>(`${this.url}/saldos-actuales-empleados`));
  }

  async obtenerCartera(parametros: {
    fecha_inicio: string | null;
    fecha_fin: string | null;
    otorgante_id: number | null;
  }) {
    return await firstValueFrom(this.http.post<CarteraResponse>(`${this.url}/cartera`, parametros));
  }

  async obtenerMovimientos(parametros: {
    fecha_inicio: string | null;
    fecha_fin: string | null;
    empleado_id: number | null;
  }) {
    return await firstValueFrom(
      this.http.post<{
        fecha_inicio: string;
        fecha_fin: string;
        movimientos: Movimientos[];
        total_registros: number;
      }>(`${this.url}/historial-movimientos`, parametros),
    );
  }

  async obtenerHistorialArqueos(parametros: {
    fecha_inicio: string | null;
    fecha_fin: string | null;
    empleado_id: number | null;
  }) {
    return await firstValueFrom(
      this.http.post<{
        fecha_inicio: string;
        fecha_fin: string;
        arqueos: Caja[];
        totales: TotalCaja;
      }>(`${this.url}/historial-arqueos`, parametros),
    );
  }
}
