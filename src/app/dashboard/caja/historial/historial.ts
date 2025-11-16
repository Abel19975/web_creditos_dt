import { Component, inject, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';

import { CajaService } from '../caja-service';
import { Caja } from '../caja-interface';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { Empleado } from '../../../shared/interfaces/empleado';
import { DatePicker } from 'primeng/datepicker';
import { AlertService } from '../../../shared/services/alert.service';

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
  ],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export default class Historial implements OnInit {
  private historialSvc = inject(CajaService);
  protected alerta = inject(AlertService);

  protected historial = signal<Caja[]>([]);
  protected saldoActuales = signal<Caja[]>([]);
  private todosLosEmpleados = signal<Empleado[]>([]);
  protected empleados = signal<Empleado[]>([]);

  empleadoSeleccionado: Empleado | null = null;

  protected fechaInicio = signal<Date>(new Date(new Date().setDate(new Date().getDate() - 6)));
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
    const res = await this.historialSvc.arquearCaja(empleado.persona_id);
    await this.cargarDatos();
    this.alerta.exito('Éxito', res.message);
  }

  async cargarHistorial() {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();
    const empleadoId = this.empleadoSeleccionado ? this.empleadoSeleccionado.persona_id : null;
    const historial = await this.historialSvc.obtenerHistorialArqueos({
      fecha_inicio: this.formatearFecha(inicio),
      fecha_fin: this.formatearFecha(fin),
      empleado_id: empleadoId,
    });
    this.historial.set(historial);
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

  async obtenerEmpleados() {
    const respuesta = await this.historialSvc.obtenerEmpleados();
    this.todosLosEmpleados.set(respuesta.data);
    this.empleados.set(respuesta.data);
  }

  protected onFechaChange() {
    this.cargarHistorial();
  }

  async cargarDatos() {
    await this.obtenerEmpleados();
    // if (this.todosLosEmpleados().length > 0 && !this.empleadoSeleccionado) {
    //   this.empleadoSeleccionado = this.todosLosEmpleados()[0];
    // }
    await this.cargarHistorial();
    await this.obtenerSaldosActualesEmpleados();
  }

  ngOnInit(): void {
    this.cargarDatos();
  }
}
