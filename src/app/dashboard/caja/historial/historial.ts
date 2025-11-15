import { Component, inject, OnInit, signal } from '@angular/core';
import { CajaService } from '../caja-service';
import { Caja } from '../caja-interface';

@Component({
  selector: 'app-historial',
  imports: [],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export default class Historial implements OnInit {
  private historialSvc = inject(CajaService);
  protected historial = signal<Caja[]>([]);

  async cargarHistorial() {
    const historial = await this.historialSvc.obtenerHistorialArqueos({
      fecha_inicio: '22025-11-14',
      fecha_fin: '2025-11-15',
      empleado_id: 22,
    });
    this.historial.set(historial);
  }

  ngOnInit(): void {
    this.cargarHistorial();
  }
}
