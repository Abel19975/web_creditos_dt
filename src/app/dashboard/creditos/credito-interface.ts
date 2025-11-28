import { Empresa, Persona } from '../../auth/auth-interface';

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

export const TIPOS_CREDITO_VALUES = ['nuevo', 'renovacion_normal', 'renovacion_inactivo'] as const;
export type TipoCredito = (typeof TIPOS_CREDITO_VALUES)[number];

export interface FiltrosCredito {
  search?: string;
  estado?: string;
  otorgante_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  per_page?: number;
  page?: number;
}

export interface Credito {
  id: number;
  empresa_id: number;
  otorgante_id: number;
  cliente_id: number;
  otorgante: Persona;
  cliente: Cliente;
  fecha_credito: Date;
  secuencial: string;
  valor_credito: string;
  tasa_interes: string;
  total: string;
  pagado: string;
  saldo: string;
  numero_cuotas: number;
  valor_cuotas: string;
  valor_micro_seguro: string;
  estado: 'vigente' | 'pagado';
  estado_renovacion: 'nuevo' | 'renovado' | 'inactivo';
  cuotas_pagadas: number;
  cuotas_vencidas: number;
  color_cuotas: string;
  ultima_fecha_pago: string;
  proxima_fecha_pago: string;
  porcentaje_cuotas_pagadas: string;

  puede_renovar: boolean;
  es_renovable: boolean;
  boton_etiqueta: string;
  boton_color: string;

  empresa: Empresa;
  pagos: Pago[];
  created_at: Date;
  updated_at: Date;
}

export interface Cliente {
  persona_id: number;
  persona: Persona;
  fecha_registro: Date;
}

export interface Pago {
  id: number;
  credito_id: number;
  secuencial: string;
  fecha_pago: string;
  valor_pago: string;
  observaciones: string;
  saldo_anterior: string;
  saldo_actual: string;
  created_at: string;
  updated_at: string;
}
