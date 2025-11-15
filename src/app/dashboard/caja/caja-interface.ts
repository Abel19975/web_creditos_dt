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
}

export interface Empleado {
  id: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  celular: string;
  direccion: string;
  created_at: Date;
  updated_at: Date;
}
