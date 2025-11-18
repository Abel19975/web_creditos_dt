import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Credito, FiltrosCredito, PaginationResponse } from './credito-interface';

@Injectable({
  providedIn: 'root',
})
export class CreditoService {
  private http = inject(HttpClient);

  async descargarReporteDetallado(creditoId: number) {
    return await firstValueFrom(
      this.http.get(`${environment.apiUrl}/creditos/${creditoId}/pdf`, {
        responseType: 'blob',
      }),
    );
  }

  async listarCreditos(
    estado: string | null,
    otorganteId: number | null,
    fechaInicio: string | null,
    fechaFin: string | null,
    search: string | null,
    page: number = 1,
    perPage: number = 15,
  ) {
    let params = new HttpParams();

    if (estado) params = params.set('estado', estado);
    if (otorganteId) params = params.set('otorgante_id', otorganteId.toString());
    if (fechaInicio) params = params.set('fecha_inicio', fechaInicio);
    if (fechaFin) params = params.set('fecha_fin', fechaFin);
    if (search) params = params.set('search', search);
    params = params.set('page', page.toString());
    params = params.set('per_page', perPage.toString());

    return await firstValueFrom(
      this.http.get<{ fecha_inicio: string; fecha_fin: string; data: Credito[]; pagination: any }>(
        `${environment.apiUrl}/creditos`,
        {
          params,
        },
      ),
    );
  }
}
