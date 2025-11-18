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
  fecha_credito: Date;
  secuencial: string;
  valor_credito: string;
  tasa_interes: string;
  numero_cuotas: number;
  valor_cuotas: string;
  valor_micro_seguro: string;
  estado: string;
  total: string;
  pagado: string;
  saldo: string;
  cliente_id: number;
  otorgante_id: number;
  cuotas_pagadas: number;
  cuotas_vencidas: number;
  color_semaforo: string;
  empresa: Empresa;
  cliente: Cliente;
  otorgante: Persona;
  created_at: Date;
  updated_at: Date;
}

export interface Cliente {
  persona_id: number;
  persona: Persona;
  fecha_registro: Date;
}
