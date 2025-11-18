export interface FormularioEmpleado {
  id: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  celular: string;
  direccion: string;
  valor_caja: string;
  username: string;
  password: string;
}

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
  usuario: {
    id: number;
    empresa_id: number;
    persona_id: number;
    username: 'juan';
    active: true;
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
