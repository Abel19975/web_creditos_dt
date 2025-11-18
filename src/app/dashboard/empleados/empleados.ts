import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Empleado } from './empleado-interface';
import { EmpleadoService } from './empleado-service';
import { TableModule } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Dialog } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { Message } from 'primeng/message';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AlertService } from '../../shared/services/alert.service';
import { UtilsService } from '../../shared/services/utils-service';

@Component({
  selector: 'app-empleados',
  imports: [
    TableModule,
    CurrencyPipe,
    Button,
    TooltipModule,
    Dialog,
    ReactiveFormsModule,
    FloatLabel,
    Message,
    InputText,
    InputNumber,
  ],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css',
})
export default class Empleados implements OnInit {
  protected empleados = signal<Empleado[]>([]);
  private empleadoSvc = inject(EmpleadoService);
  private alerta = inject(AlertService);
  protected utilSvc = inject(UtilsService);

  protected modal = signal<boolean>(false);

  protected form = new FormGroup({
    id: new FormControl(),
    identificacion: new FormControl<string | null>(null, Validators.required),
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    celular: new FormControl<string | null>(null, Validators.required),
    direccion: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    valor_caja: new FormControl<string | null>(null, Validators.required),
  });
  getControl(nameCtrl: string) {
    return this.form.get(nameCtrl) as FormControl;
  }

  private empleadoSeleccionado = signal<Empleado | null>(null);

  protected mostrarOtrosCampos = computed(() => {
    const empleado = this.empleadoSeleccionado();
    return !!empleado;
  });

  protected esInvalido(name: string) {
    const control = this.getControl(name);
    return control.invalid && control.touched;
  }

  abrirModalFormulario() {
    this.modal.set(true);
  }
  cerrarModalFormulario() {
    this.empleadoSeleccionado.set(null);
    this.modal.set(false);
    this.form.reset();
  }

  seleccionarParaEditar(empleado: Empleado) {
    this.empleadoSeleccionado.set(empleado);
    this.getControl('username').clearValidators();
    this.getControl('password').clearValidators();
    this.getControl('valor_caja').clearValidators();
    this.getControl('username').updateValueAndValidity();
    this.getControl('password').updateValueAndValidity();
    this.getControl('valor_caja').updateValueAndValidity();

    this.form.patchValue({
      id: empleado.persona.id,
      identificacion: empleado.persona.identificacion,
      nombres: empleado.persona.nombres,
      apellidos: empleado.persona.apellidos,
      celular: empleado.persona.celular,
      direccion: empleado.persona.direccion,
      username: empleado.usuario.username,
      valor_caja: `${empleado.totales.valor_caja}`,
    });
    this.abrirModalFormulario();
  }

  async eliminarEmpleado(empleado: Empleado) {
    const confirmar = await this.alerta.confirmDelete(
      'Confirmar eliminación',
      `¿Está segur@ de eliminar a ${empleado.persona.nombre_completo}?`,
    );
    if (!confirmar) return;
    const res = await this.empleadoSvc.eliminarEmpleado(empleado.persona.id);
    this.alerta.exito('Éxito', res.message);
    this.empleados.update((values) => values.filter((v) => v.persona.id !== empleado.persona.id));
  }

  async guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const res = await this.empleadoSvc.guardarEmpleado({
      id: this.getControl('id').value,
      identificacion: String(this.getControl('identificacion').value),
      nombres: this.getControl('nombres').value,
      apellidos: this.getControl('apellidos').value,
      celular: String(this.getControl('celular').value),
      direccion: this.getControl('direccion').value,
      username: this.getControl('username').value,
      password: this.getControl('password').value,
      valor_caja: this.getControl('valor_caja').value,
    });
    this.alerta.exito('Éxito', res.message);
    this.cerrarModalFormulario();
    this.cargarEmpleados();
  }

  async cargarEmpleados() {
    const res = await this.empleadoSvc.obtenerEmpleados();
    this.empleados.set(res.data);
  }

  ngOnInit(): void {
    this.cargarEmpleados();
  }
}
