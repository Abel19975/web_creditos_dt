import { Component, inject, signal, viewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePicker } from 'primeng/datepicker';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { FormControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

import { Empleado } from '../empleados/empleado-interface';
import { CajaService } from '../caja/caja-service';
import { UtilidadesFecha } from '../../shared/utils/utils';
import { FechaUtcService } from '../../shared/utils/fecha-utc-service';
import { AlertService } from '../../shared/services/alert.service';
import { Cliente, Credito, TipoCredito, TIPOS_CREDITO_VALUES } from './credito-interface';
import { CreditoService } from './credito-service';

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
    TooltipModule,
    Select,
    Dialog,
    InputNumber,
    ReactiveFormsModule,
    CardModule,
    DividerModule,
    CommonModule,
  ],
  templateUrl: './creditos.html',
  styleUrl: './creditos.css',
})
export default class Creditos {
  protected valorCreditoInput = viewChild.required<InputNumber>('valorCreditoInput');

  private creditoService = inject(CreditoService);
  private historialSvc = inject(CajaService);
  protected fechaUtcSvc = inject(FechaUtcService);
  private alerta = inject(AlertService);

  protected empleadoSeleccionado = signal<Empleado | null>(null);
  protected clienteSeleccionado = signal<Cliente | null>(null);
  private todosLosEmpleados = signal<Empleado[]>([]);
  private todosLosClientes = signal<Cliente[]>([]);
  protected empleados = signal<Empleado[]>([]);
  protected clientes = signal<Cliente[]>([]);
  protected creditos = signal<Credito[]>([]);
  protected pagination = signal({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  });

  protected search = signal<string>('');
  protected estado = signal<string | null | boolean>(null);
  protected otorganteId = signal<number | null>(null);
  protected fechaInicio = signal<Date | null>(null);
  protected fechaFin = signal<Date | null>(null);
  protected fechaInicioAux = signal<Date | null>(null);
  protected modalValorRenovacion = signal<boolean>(false);
  protected creditoSeleccionado = signal<Credito | null>(null);
  protected valorCredito = new FormControl(null, Validators.required);

  protected esInvalidoControl() {
    const control = this.valorCredito;
    return control.touched && control.invalid;
  }

  protected estadoCreditos = signal([
    {
      nombre: 'Pagados',
      valor: 'pagado',
    },
    {
      nombre: 'Vigentes',
      valor: 'vigente',
    },
    {
      nombre: 'Inactivos',
      valor: 'inactivo',
    },
  ]);
  protected estadosRenovacion = signal([
    {
      nombre: 'Nuevos',
      valor: 'nuevo',
    },
    {
      nombre: 'Renovados',
      valor: 'renovado',
    },
    {
      nombre: 'Inactivos',
      valor: 'inactivo',
    },
  ]);

  convertToNumber(value?: string) {
    if (!value) return 0;
    return parseFloat(value);
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
    if (credito.color_cuotas === 'success') {
      return 'success';
    }
    if (credito.color_cuotas === 'warning') {
      return 'warn';
    }
    return 'danger';
  }

  async ngOnInit() {
    this.cargarEmpleados();
    this.cargarClientes();
  }

  protected buscarCliente(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    const filtrados = this.todosLosClientes().filter((empleado) =>
      empleado.persona.nombre_completo.toLowerCase().includes(query),
    );
    this.clientes.set(filtrados);
  }

  protected buscarEmpleado(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    const filtrados = this.todosLosEmpleados().filter((empleado) =>
      empleado.persona.nombre_completo.toLowerCase().includes(query),
    );
    this.empleados.set(filtrados);
  }

  async cargarClientes() {
    const res = await this.historialSvc.obtenerClientes();
    this.todosLosClientes.set(res.data);
    this.todosLosClientes.set(res.data);
  }

  async cargarEmpleados() {
    const res = await this.historialSvc.obtenerEmpleados();
    this.todosLosEmpleados.set(res.data);
    this.empleados.set(res.data);
  }

  async descargarReporteDetallado(credito: Credito) {
    const pdfBlob = await this.creditoService.descargarReporteDetallado(credito.id);
    const url = window.URL.createObjectURL(pdfBlob);

    window.open(url, '_blank');
    window.URL.revokeObjectURL(url);
  }

  protected abrirCerrarModalRenovacion(credito?: Credito) {
    if (!credito) {
      this.creditoSeleccionado.set(null);
      this.modalValorRenovacion.set(false);
      return;
    }
    this.creditoSeleccionado.set(credito);
    this.modalValorRenovacion.set(true);
  }

  protected async renovarCredito() {
    const credito = this.creditoSeleccionado();
    if (!credito) return;

    const valor = this.valorCreditoInput().value;
    if (!valor) {
      this.valorCreditoInput().input.nativeElement.focus();
      return;
    }

    const confirmar = await this.alerta.confirm({
      title: 'Confirmación',
      message: `¿Desea renovar el crédito ${credito.secuencial} de ${credito.cliente.persona.nombre_completo}, por un valor de $${Number(valor).toFixed(2)} ?`,
    });
    if (!confirmar) return;
    const res = await this.creditoService.renovarCredito({
      cliente_id: credito.cliente.persona_id,
      valor_credito: valor,
    });
    this.abrirCerrarModalRenovacion();
    this.alerta.exito('Éxito', res.message);
    this.cargarCreditos();
  }

  private async cargarCreditos(pagina: number = 1) {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();
    const empleadoId = this.empleadoSeleccionado() ? this.empleadoSeleccionado()!.persona_id : null;
    const clienteId = this.clienteSeleccionado() ? this.clienteSeleccionado()!.persona_id : null;
    const estadoValue = this.estado();

    const res = await this.creditoService.listarCreditos(
      estadoValue,
      empleadoId,
      clienteId,
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

    this.estado.set(null);
    this.empleadoSeleccionado.set(null);
    this.clienteSeleccionado.set(null);
    this.search.set('');
    this.aplicarFiltros();
  }

  protected async onPageChange(event: any) {
    const pagina = Math.floor(event.first / this.pagination().per_page) + 1;
    await this.cargarCreditos(pagina);
  }

  async aplicarFiltros() {
    await this.cargarCreditos(1);
  }

  async refrescar() {
    this.resetearFiltros();
  }
}
