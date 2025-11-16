export interface Empleado {
  persona_id: number;
  persona: {
    id: number;
    identificacion: string;
    nombres: string;
    apellidos: string;
    nombre_completo: string;
    celular: string;
    direccion: string;
  };
  totales: {
    total_capital_otorgado: number;
    total_a_recaudar: number;
    total_recaudado: number;
    total_faltante: number;
    valor_caja: number;
  };
  puede_eliminar: boolean;
}
