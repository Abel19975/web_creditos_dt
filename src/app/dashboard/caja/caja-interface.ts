import { Empleado } from '../empleados/empleado-interface';

export interface TotalCaja {
  saldo_anterior: string;
  total_recaudado: string;
  total_microseguro: string;
  total_ingresos: string;
  total_desembolso: string;
  total_otros_egresos: string;
  total_egresos: string;
  total_caja: string;
  cantidad_arqueos: number;
}

export interface Caja {
  id: number;
  empleado_id: number;
  administrador_id: number;
  fecha_arqueo: Date;
  saldo_anterior: string;
  total_recaudado: string;
  total_microseguro: string;
  total_ingresos: string;
  total_desembolso: string;
  total_otros_egresos: string;
  total_egresos: string;
  total_caja: string;
  notas: null;
  created_at: Date;
  updated_at: Date;
  empleado: Empleado;
  arqueado: boolean;
}

export interface Movimientos {
  id: number;
  empleado_id: number;
  tipo: 'ingreso' | 'egreso';
  monto: string;
  saldo_resultante: string;
  descripcion: string;
  relacionado_id: null | string;
  relacionado_type: null | string;
  created_at: string;
  updated_at: string;
  empleado: Empleado;
}

export interface CarteraResponse {
  fecha_inicio: string;
  fecha_fin: string;
  cartera: Cartera[];
  total_general: TotalGeneral;
}

export interface Cartera {
  otorgante_id: number;
  otorgante: Otorgante;
  total_prestado: string;
  total_cobrado: string;
  total_pendiente: string;
  porcentaje_cobrado: string;
  cantidad_creditos: number;
}

export interface Otorgante {
  id: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  celular: string;
  direccion: string;
  created_at: Date;
  updated_at: Date;
  nombre_completo: string;
}

export interface TotalGeneral {
  total_prestado: string;
  total_cobrado: string;
  total_pendiente: string;
  porcentaje_cobrado: string;
  cantidad_creditos_total: number;
}
