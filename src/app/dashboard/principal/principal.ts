import { Component, computed, effect, inject, signal, ViewChild, OnInit } from '@angular/core';
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexPlotOptions,
  ApexFill,
} from 'ng-apexcharts';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { ThemeService } from '../../shared/services/theme.service';
import { CajaService } from '../caja/caja-service';
import { Empleado } from '../empleados/empleado-interface';
import { UtilidadesFecha } from '../../shared/utils/utils';
import { Cartera, TotalGeneral } from '../caja/caja-interface';
import { FechaUtcService } from '../../shared/utils/fecha-utc-service';

export type ChartOptionsBar = {
  colors: string[];
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  tooltip?: any;
};

interface CarteraComparativa {
  periodo1: {
    fechaInicio: Date;
    fechaFin: Date;
    cartera: Cartera[];
    total: TotalGeneral | null;
  };
  periodo2: {
    fechaInicio: Date;
    fechaFin: Date;
    cartera: Cartera[];
    total: TotalGeneral | null;
  };
}

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    ChartComponent,
    TableModule,
    CommonModule,
    FormsModule,
    FloatLabelModule,
    DatePickerModule,
  ],
  templateUrl: './principal.html',
  styleUrl: './principal.css',
})
export default class Principal {
  @ViewChild('chartBar') chartBar!: ChartComponent;

  private themeSvc = inject(ThemeService);
  private cajaSvc = inject(CajaService);
  protected fechaUtcSvc = inject(FechaUtcService);

  protected isDarkMode = this.themeSvc.isDarkMode;
  protected themeColor = computed(() => (this.themeSvc.isDarkMode() ? '#fff' : '#000'));

  protected fechaInicio1 = signal<Date | null>(null);
  protected fechaFin1 = signal<Date | null>(null);
  protected fechaInicio2 = signal<Date | null>(null);
  protected fechaFin2 = signal<Date | null>(null);
  protected maxDate = signal<Date>(new Date());

  protected carteraComparativa = signal<CarteraComparativa | null>(null);
  protected chartOptionsBar = signal<Partial<ChartOptionsBar> | null>(null);

  constructor() {
    // Efecto para actualizar gráfico cuando cambia el tema
    effect(() => {
      if (this.carteraComparativa()) {
        this.actualizarGrafico();
      }
    });
  }
  protected async obtenerCarteraComparativa() {
    const inicio1 = this.fechaInicio1();
    const fin1 = this.fechaFin1();
    const inicio2 = this.fechaInicio2();
    const fin2 = this.fechaFin2();

    try {
      // Obtener datos del primer período
      const res1 = await this.cajaSvc.obtenerCartera({
        fecha_inicio: inicio1 ? UtilidadesFecha.formatearFecha(inicio1) : null,
        fecha_fin: fin1 ? UtilidadesFecha.formatearFecha(fin1) : null,
        otorgante_id: null,
      });

      // Obtener datos del segundo período
      const res2 = await this.cajaSvc.obtenerCartera({
        fecha_inicio: inicio2 ? UtilidadesFecha.formatearFecha(inicio2) : null,
        fecha_fin: fin2 ? UtilidadesFecha.formatearFecha(fin2) : null,
        otorgante_id: null,
      });

      const fechaInicio1Conv = this.fechaUtcSvc.convertirUtcALocal(res1.fecha_inicio);
      const fechaFin1Conv = this.fechaUtcSvc.convertirUtcALocal(res1.fecha_fin);
      const fechaInicio2Conv = this.fechaUtcSvc.convertirUtcALocal(res2.fecha_inicio);
      const fechaFin2Conv = this.fechaUtcSvc.convertirUtcALocal(res2.fecha_fin);
      this.fechaInicio1.set(fechaInicio1Conv);
      this.fechaInicio2.set(fechaInicio2Conv);
      this.fechaFin1.set(fechaFin1Conv);
      this.fechaFin2.set(fechaFin1Conv);

      this.carteraComparativa.set({
        periodo1: {
          fechaInicio: fechaInicio1Conv,
          fechaFin: fechaFin1Conv,
          cartera: res1.cartera,
          total: res1.total_general,
        },
        periodo2: {
          fechaInicio: fechaInicio2Conv,
          fechaFin: fechaFin2Conv,
          cartera: res2.cartera,
          total: res2.total_general,
        },
      });

      this.actualizarGrafico();
    } catch (error) {
      console.error('Error al obtener cartera comparativa:', error);
    }
  }

  private actualizarGrafico() {
    const comp = this.carteraComparativa();

    if (!comp || comp.periodo1.cartera.length === 0 || comp.periodo2.cartera.length === 0) return;

    // Obtener todos los empleados únicos
    const empleados = new Map<number, string>();
    comp.periodo1.cartera.forEach((c) => empleados.set(c.otorgante_id, c.otorgante.nombres));
    comp.periodo2.cartera.forEach((c) => empleados.set(c.otorgante_id, c.otorgante.nombres));

    const nombres = Array.from(empleados.values());
    const empleadoIds = Array.from(empleados.keys());

    // Crear mapas para búsqueda rápida
    const map1 = new Map(comp.periodo1.cartera.map((c) => [c.otorgante_id, c]));
    const map2 = new Map(comp.periodo2.cartera.map((c) => [c.otorgante_id, c]));

    // Datos para ambos períodos (obteniendo directamente los campos)
    const prestado1 = empleadoIds.map((id) => parseFloat(map1.get(id)?.total_prestado || '0'));
    const cobrado1 = empleadoIds.map((id) => parseFloat(map1.get(id)?.total_cobrado || '0'));
    const pendiente1 = empleadoIds.map((id) => parseFloat(map1.get(id)?.total_pendiente || '0'));

    const prestado2 = empleadoIds.map((id) => parseFloat(map2.get(id)?.total_prestado || '0'));
    const cobrado2 = empleadoIds.map((id) => parseFloat(map2.get(id)?.total_cobrado || '0'));
    const pendiente2 = empleadoIds.map((id) => parseFloat(map2.get(id)?.total_pendiente || '0'));

    const opciones: Partial<ChartOptionsBar> = {
      colors: ['#2563eb', '#60a5fa', '#22c55e', '#dc2626', '#f87171', '#fbbf24'],
      series: [
        {
          name: `Prestado (Período 1)`,
          data: prestado1,
        },
        {
          name: `Cobrado (Período 1)`,
          data: cobrado1,
        },
        {
          name: `Pendiente (Período 1)`,
          data: pendiente1,
        },
        {
          name: `Prestado (Período 2)`,
          data: prestado2,
        },
        {
          name: `Cobrado (Período 2)`,
          data: cobrado2,
        },
        {
          name: `Pendiente (Período 2)`,
          data: pendiente2,
        },
      ],
      chart: {
        height: 450,
        type: 'bar',
        toolbar: {
          show: false,
        },
        background: this.isDarkMode() ? '#0f172a' : '#fff',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: nombres,
        labels: {
          style: {
            colors: this.themeColor(),
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Monto ($)',
          style: {
            color: this.themeColor(),
          },
        },
        labels: {
          style: {
            colors: this.themeColor(),
          },
        },
      },
      fill: {
        type: 'gradient',
        opacity: 1,
      },
      title: {
        text: 'Comparativa de Cartera entre Períodos',
        style: {
          color: this.themeColor(),
          fontSize: '16px',
        },
      },
      legend: {
        labels: {
          colors: this.themeColor(),
        },
      },
      tooltip: {
        theme: this.isDarkMode() ? 'dark' : 'light',
        style: {
          fontSize: '12px',
        },
      },
    };

    this.chartOptionsBar.set(opciones);
  }

  protected parseFloat(value: string): number {
    return parseFloat(value);
  }
}
