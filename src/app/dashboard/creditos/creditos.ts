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
  protected fechaInicio = signal<Date>(
    new Date(new Date().setDate(new Date().getDate() - RANGO_DIAS)),
  );
  protected fechaFin = signal<Date>(new Date());
  protected maxDate = signal<Date>(new Date());

  private formatearFecha(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const día = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${día}`;
  }

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
    this.cargarEmpleados();
    await this.cargarCreditos();
  }

  protected onSearch(event: AutoCompleteCompleteEvent) {
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
    const empleadoId = this.empleadoSeleccionado()
      ? this.empleadoSeleccionado()!.persona_id
      : undefined;

    const response = await this.creditoService.listarCreditos(
      this.estado(),
      empleadoId,
      this.formatearFecha(inicio),
      this.formatearFecha(fin),
      this.search(),
      pagina,
      this.pagination().per_page,
    );

    this.creditos.set(response.data);
    this.pagination.set(response.pagination);
  }

  protected resetearFiltros() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const hace9Dias = new Date(hoy);
    hace9Dias.setDate(hace9Dias.getDate() - RANGO_DIAS);

    this.fechaInicio.set(hace9Dias);
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
