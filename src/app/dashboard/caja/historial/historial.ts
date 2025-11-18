import { Component, inject, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';

import { CajaService } from '../caja-service';
import { Caja, Movimientos, TotalCaja } from '../caja-interface';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { Empleado } from '../../empleados/empleado-interface';
import { DatePicker } from 'primeng/datepicker';
import { AlertService } from '../../../shared/services/alert.service';
import { Tooltip } from 'primeng/tooltip';

const RANGO_DIAS = 9;

@Component({
  selector: 'app-historial',
  imports: [
    TableModule,
    ButtonModule,
    DatePipe,
    CurrencyPipe,
    FormsModule,
    FloatLabelModule,
    AutoCompleteModule,
    DatePicker,
    Tooltip,
  ],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export default class Historial implements OnInit {
  private historialSvc = inject(CajaService);
  protected alerta = inject(AlertService);

  protected historial = signal<Caja[]>([]);
  protected totalesHistorial = signal<TotalCaja | null>(null);

  protected saldoActuales = signal<Caja[]>([]);
  private todosLosEmpleados = signal<Empleado[]>([]);
  protected empleados = signal<Empleado[]>([]);
  protected movimientos = signal<Movimientos[]>([]);

  protected empleadoSeleccionado = signal<Empleado | null>(null);

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

  async arquearCaja(empleado: Empleado) {
    const confirmar = await this.alerta.confirm({
      title: 'Confirmar acción',
      message: `¿Segur@ de realizar el arqueo de esta caja al empleado ${empleado.persona.nombre_completo}?`,
    });
    if (!confirmar) return;
    const mensaje = await this.historialSvc.arquearCaja(empleado.persona_id);
    await this.cargarDatos();
    this.alerta.exito('Éxito', mensaje);
  }

  async cargarHistorial() {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();
    const empleadoId = this.empleadoSeleccionado() ? this.empleadoSeleccionado()!.persona_id : null;
    const res = await this.historialSvc.obtenerHistorialArqueos({
      fecha_inicio: this.formatearFecha(inicio),
      fecha_fin: this.formatearFecha(fin),
      empleado_id: empleadoId,
    });
    this.historial.set(res.arqueos);
    this.totalesHistorial.set(res.totales);
  }

  async obtenerSaldosActualesEmpleados() {
    const saldoActuales = await this.historialSvc.obtenerSaldosActualesEmpleados();
    this.saldoActuales.set(saldoActuales);
  }

  protected search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    const filtrados = this.todosLosEmpleados().filter((empleado) =>
      empleado.persona.nombre_completo.toLowerCase().includes(query),
    );
    this.empleados.set(filtrados);
  }

  async cargarMovimientos() {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();
    const empleadoId = this.empleadoSeleccionado() ? this.empleadoSeleccionado()!.persona_id : null;
    const movimientos = await this.historialSvc.obtenerMovimientos({
      fecha_inicio: this.formatearFecha(inicio),
      fecha_fin: this.formatearFecha(fin),
      empleado_id: empleadoId,
    });
    this.movimientos.set(movimientos);
  }

  async cargarEmpleados() {
    const res = await this.historialSvc.obtenerEmpleados();
    this.todosLosEmpleados.set(res.data);
    this.empleados.set(res.data);
  }

  protected onFechaChange() {
    this.cargarHistorial();
  }
  protected resetearFiltros() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const hace9Dias = new Date(hoy);
    hace9Dias.setDate(hace9Dias.getDate() - RANGO_DIAS);

    this.fechaInicio.set(hace9Dias);
    this.fechaFin.set(hoy);
    this.empleadoSeleccionado.set(null);
    this.cargarDatos();
  }
  async cargarDatos() {
    await this.cargarEmpleados();
    await this.cargarHistorial();
    await this.obtenerSaldosActualesEmpleados();
    await this.cargarMovimientos();
  }

  ngOnInit(): void {
    this.cargarDatos();
  }
}
