import { Component, inject, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';

import { CajaService } from '../caja-service';
import { Caja, Movimientos, TotalCaja } from '../caja-interface';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { Empleado } from '../../empleados/empleado-interface';
import { DatePicker } from 'primeng/datepicker';
import { AlertService } from '../../../shared/services/alert.service';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { UtilidadesFecha } from '../../../shared/utils/utils';
import { FechaUtcService } from '../../../shared/utils/fecha-utc-service';
import { Message } from 'primeng/message';
import { Dialog } from 'primeng/dialog';
import { UtilsService } from '../../../shared/services/utils-service';
import { InputNumber } from 'primeng/inputnumber';

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
    Message,
    Dialog,
    TextareaModule,
    ReactiveFormsModule,
    InputNumber,
    TooltipModule,
  ],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export default class Historial implements OnInit {
  private historialSvc = inject(CajaService);
  protected alerta = inject(AlertService);
  protected fechaUtcSvc = inject(FechaUtcService);
  protected utilSvc = inject(UtilsService);

  protected historial = signal<Caja[]>([]);
  protected totalesHistorial = signal<TotalCaja | null>(null);

  protected saldoActuales = signal<Caja[]>([]);
  private todosLosEmpleados = signal<Empleado[]>([]);
  protected empleados = signal<Empleado[]>([]);
  protected movimientos = signal<Movimientos[]>([]);

  protected empleadoSeleccionado = signal<Empleado | null>(null);

  protected fechaInicio = signal<Date | null>(null);
  protected fechaFin = signal<Date | null>(null);
  protected fechaInicioAux = signal<Date | null>(null);
  protected maxDate = signal<Date>(new Date());
  protected modal = signal<boolean>(false);

  protected form = new FormGroup({
    empleado_id: new FormControl(null, Validators.required),
    monto: new FormControl(null, Validators.required),
    descripcion: new FormControl(null, Validators.required),
  });
  getControl(nameCtrl: string) {
    return this.form.get(nameCtrl) as FormControl;
  }

  protected esInvalido(name: string) {
    const control = this.getControl(name);
    return control.invalid && control.touched;
  }
  protected abrirModalFormularioEgreso() {
    this.modal.set(true);
  }
  protected cerrarModalFormularioEgreso() {
    this.modal.set(false);
    this.form.reset();
  }

  // REGISTRAR EGRESO
  async registrarEgreso() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const res = await this.historialSvc.registrarEgreso({
      empleado_id: this.getControl('empleado_id').value,
      monto: this.getControl('monto').value,
      descripcion: this.getControl('descripcion').value,
    });
    this.alerta.exito('Éxito', res.message);
    this.cerrarModalFormularioEgreso();
    this.cargarDatos();
  }

  // OBTENER SALDOS ACTUALES DE TODOS LOS EMPLEADOS
  async obtenerSaldosActualesEmpleados() {
    const saldoActuales = await this.historialSvc.obtenerSaldosActualesEmpleados();
    this.saldoActuales.set(saldoActuales);
  }

  // OBTENER HISTORIAL ARQUEOS DE CAJA
  async cargarHistorialArqueos() {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();
    const empleadoId = this.empleadoSeleccionado() ? this.empleadoSeleccionado()!.persona_id : null;
    const res = await this.historialSvc.obtenerHistorialArqueos({
      fecha_inicio: inicio ? UtilidadesFecha.formatearFecha(inicio) : null,
      fecha_fin: fin ? UtilidadesFecha.formatearFecha(fin) : null,
      empleado_id: empleadoId,
    });
    this.historial.set(res.arqueos);
    this.totalesHistorial.set(res.totales);

    const fechaInicio = this.fechaUtcSvc.convertirUtcALocal(res.fecha_inicio);
    const fechaFin = this.fechaUtcSvc.convertirUtcALocal(res.fecha_fin);

    this.fechaInicio.set(fechaInicio);
    this.fechaFin.set(fechaFin);
    if (this.fechaInicioAux()) return;
    this.fechaInicioAux.set(fechaInicio);
  }

  // OBTENER HISTORIAL DE MOVIMIENTOS
  async cargarMovimientos() {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();
    const empleadoId = this.empleadoSeleccionado() ? this.empleadoSeleccionado()!.persona_id : null;
    const res = await this.historialSvc.obtenerMovimientos({
      fecha_inicio: inicio ? UtilidadesFecha.formatearFecha(inicio) : null,
      fecha_fin: fin ? UtilidadesFecha.formatearFecha(fin) : null,
      empleado_id: empleadoId,
    });
    this.movimientos.set(res.movimientos);
  }

  // OBTENER EMPLEADOS
  async obtenerEmpleados() {
    const res = await this.historialSvc.obtenerEmpleados();
    this.todosLosEmpleados.set(res.data);
    this.empleados.set(res.data);
  }
  protected buscarEmpleado(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    const filtrados = this.todosLosEmpleados().filter((empleado) =>
      empleado.persona.nombre_completo.toLowerCase().includes(query),
    );
    this.empleados.set(filtrados);
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

  protected resetearFiltros() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    this.fechaInicio.set(this.fechaInicioAux());
    this.fechaFin.set(hoy);
    this.empleadoSeleccionado.set(null);
    this.cargarDatos();
  }

  async cargarDatos() {
    await this.obtenerEmpleados();
    await this.cargarHistorialArqueos();
    await this.obtenerSaldosActualesEmpleados();
    await this.cargarMovimientos();
  }

  ngOnInit(): void {
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    this.maxDate.set(hoy);

    this.cargarDatos();
  }
}
