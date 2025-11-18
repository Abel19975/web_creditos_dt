import { Component, inject, signal } from '@angular/core';
import { CreditoService } from './credito-service';
import { Credito } from './credito-interface';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CajaService } from '../caja/caja-service';
import { Empleado } from '../empleados/empleado-interface';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePicker } from 'primeng/datepicker';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { UtilidadesFecha } from '../../shared/utils/utils';
import { FechaUtcService } from '../../shared/utils/fecha-utc-service';

const RANGO_DIAS = 9;

@Component({
  selector: 'app-creditos',
  imports: [
    TableModule,
    Button,
    CurrencyPipe,
    DatePipe,
    TagModule,
    TooltipModule,
    FloatLabel,
    DatePicker,
    AutoComplete,
    FormsModule,
  ],
  templateUrl: './creditos.html',
  styleUrl: './creditos.css',
})
export default class Creditos {
  private creditoService = inject(CreditoService);
  private historialSvc = inject(CajaService);
  protected fechaUtcSvc = inject(FechaUtcService);

  protected empleadoSeleccionado = signal<Empleado | null>(null);
  private todosLosEmpleados = signal<Empleado[]>([]);
  protected empleados = signal<Empleado[]>([]);
  protected creditos = signal<Credito[]>([]);
  protected pagination = signal({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  });

  protected search = signal('');
  protected estado = signal('');
  protected otorganteId = signal<number | null>(null);
  protected fechaInicio = signal<Date | null>(null);
  protected fechaFin = signal<Date | null>(null);
  protected fechaInicioAux = signal<Date | null>(null);
  protected maxDate = signal<Date>(new Date());

  protected severity(credito: Credito) {
    if (credito.estado === 'pagado') {
      return 'success';
    }
    if (credito.estado === 'vigente') {
      return 'warn';
    }
    return 'danger';
  }

  protected severityCuotas(credito: Credito) {
    if (credito.color_semaforo === 'verde') {
      return 'success';
    }
    if (credito.color_semaforo === 'amarillo') {
      return 'warn';
    }
    return 'danger';
  }

  async ngOnInit() {
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    this.maxDate.set(hoy);

    this.cargarEmpleados();
    await this.cargarCreditos();
  }

  protected buscarEmpleado(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    const filtrados = this.todosLosEmpleados().filter((empleado) =>
      empleado.persona.nombre_completo.toLowerCase().includes(query),
    );
    this.empleados.set(filtrados);
  }

  async cargarEmpleados() {
    const res = await this.historialSvc.obtenerEmpleados();
    this.todosLosEmpleados.set(res.data);
    this.empleados.set(res.data);
  }

  async descargarReporteDetallado(credito: Credito) {
    const pdfBlob = await this.creditoService.descargarReporteDetallado(credito.id);
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    const cliente = credito.cliente.persona.nombre_completo;
    const secuencial = credito.secuencial;
    const nombreArchivo = `${cliente}-${secuencial}.pdf`;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  async cargarCreditos(pagina: number = 1) {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();
    const empleadoId = this.empleadoSeleccionado() ? this.empleadoSeleccionado()!.persona_id : null;

    const res = await this.creditoService.listarCreditos(
      this.estado(),
      empleadoId,
      inicio ? UtilidadesFecha.formatearFecha(inicio) : null,
      fin ? UtilidadesFecha.formatearFecha(fin) : null,
      this.search(),
      pagina,
      this.pagination().per_page,
    );

    this.creditos.set(res.data);
    this.pagination.set(res.pagination);

    const fechaInicio = this.fechaUtcSvc.convertirUtcALocal(res.fecha_inicio);
    const fechaFin = this.fechaUtcSvc.convertirUtcALocal(res.fecha_fin);

    this.fechaInicio.set(fechaInicio);
    this.fechaFin.set(fechaFin);
    if (this.fechaInicioAux()) return;
    this.fechaInicioAux.set(fechaInicio);
  }

  protected resetearFiltros() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    this.fechaInicio.set(this.fechaInicioAux());
    this.fechaFin.set(hoy);

    this.empleadoSeleccionado.set(null);
    this.aplicarFiltros();
  }

  protected async onPageChange(event: any) {
    const pagina = Math.floor(event.first / this.pagination().per_page) + 1;
    await this.cargarCreditos(pagina);
  }

  async aplicarFiltros() {
    await this.cargarCreditos(1);
  }
}
