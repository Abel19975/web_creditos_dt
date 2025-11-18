export class UtilidadesFecha {
  static obtenerFechaHaceMeses(meses: number): Date {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - meses);
    return fecha;
  }

  static obtenerFechaHaceDias(dias: number): Date {
    return new Date(new Date().setDate(new Date().getDate() - dias));
  }

  static formatearFecha(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const día = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${día}`;
  }
}
