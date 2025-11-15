export interface Usuario {
  id: number;
  empresa_id: number;
  persona_id: number;
  username: string;
  email: null;
  active: boolean;
  email_verified_at: null;
  created_at: Date;
  updated_at: Date;
  roles: Role[];
  persona: Persona;
  empresa: Empresa;
}

export interface Empresa {
  id: number;
  nombre_comercial: string;
  razon_social: string;
  ruc: string;
  direccion: string;
  telefono: string;
  created_at: Date;
  updated_at: Date;
}

export interface Persona {
  id: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  celular: string;
  direccion: string;
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  created_at: Date;
  updated_at: Date;
  pivot: Pivot;
}

export interface Pivot {
  usuario_id: number;
  rol_id: number;
}
