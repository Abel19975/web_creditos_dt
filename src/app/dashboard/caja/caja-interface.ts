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
