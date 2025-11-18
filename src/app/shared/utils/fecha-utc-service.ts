import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FechaUtcService {
  /**
   * Convierte una fecha UTC ISO string a Date en zona horaria local
   * @param fechaIsoString - Fecha en formato ISO (ej: "2025-11-15T00:00:00.000000Z")
   * @returns Date en zona horaria local
   */
  convertirUtcALocal(fechaIsoString: string): Date {
    const fechaStr = fechaIsoString.split('T')[0];
    return new Date(fechaStr + 'T00:00:00');
  }

  /**
   * Convierte múltiples fechas UTC a Date local
   * @param fechas - Array de fechas en formato ISO
   * @returns Array de Dates en zona horaria local
   */
  convertirMultiplesUtcALocal(fechas: string[]): Date[] {
    return fechas.map((fecha) => this.convertirUtcALocal(fecha));
  }
}
