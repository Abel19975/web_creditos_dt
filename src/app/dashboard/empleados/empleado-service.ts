import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Empleado, FormularioEmpleado } from './empleado-interface';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private http = inject(HttpClient);

  async eliminarEmpleado(empleadoId: number) {
    return await firstValueFrom(
      this.http.delete<{ message: string }>(`${environment.apiUrl}/empleados/${empleadoId}`),
    );
  }
  async guardarEmpleado(datos: FormularioEmpleado) {
    if (datos.id) {
      return await firstValueFrom(
        this.http.put<{ message: string }>(`${environment.apiUrl}/empleados/${datos.id}`, datos),
      );
    }
    return await firstValueFrom(
      this.http.post<{ message: string }>(`${environment.apiUrl}/empleados`, datos),
    );
  }

  async obtenerEmpleados() {
    return await firstValueFrom(
      this.http.get<{ data: Empleado[] }>(`${environment.apiUrl}/empleados`),
    );
  }
}
