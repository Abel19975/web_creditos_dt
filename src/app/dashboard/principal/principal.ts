import { Component, computed, effect, inject, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
} from 'ng-apexcharts';

import { series } from './data';
import { ThemeService } from '../../shared/services/theme.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

export type ChartOptionsSeries = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type ChartOptionsBar = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-principal',
  imports: [ChartComponent],
  templateUrl: './principal.html',
  styleUrl: './principal.css',
})
export default class Principal {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  @ViewChild('chartSerie') chartSerie!: ChartComponent;
  public chartOptionsSerie!: Partial<ChartOptionsSeries>;

  @ViewChild('chartBar') chartBar!: ChartComponent;
  public chartOptionsBar!: Partial<ChartOptionsBar>;

  private themeSvc = inject(ThemeService);

  themeColor = computed(() => (this.themeSvc.isDarkMode() ? '#fff' : '#000'));

  constructor() {
    effect(() => {
      const color = this.themeColor();
      if (color) {
        this.chartOptions = {
          series: [
            {
              name: 'STOCK ABC',
              data: series.monthDataSeries1.prices,
            },
          ],
          chart: {
            type: 'area',
            height: 350,
            zoom: {
              enabled: false,
            },
            toolbar: {
              show: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'straight',
          },

          title: {
            text: 'Fundamental Analysis of Stocks',
            align: 'left',
            style: {
              color: this.themeColor(),
            },
          },
          subtitle: {
            style: {
              color: this.themeColor(),
            },
            text: 'Price Movements',
            align: 'left',
          },
          labels: series.monthDataSeries1.dates,
          xaxis: {
            type: 'datetime',
            labels: {
              style: {
                colors: this.themeColor(),
              },
            },
          },
          yaxis: {
            opposite: true,
            labels: {
              style: {
                colors: this.themeColor(),
              },
            },
          },
          legend: {
            horizontalAlign: 'left',
            labels: {
              colors: this.themeColor(),
            },
          },
        };

        this.chartOptionsBar = {
          series: [
            {
              name: 'Inflation',
              data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
            },
          ],
          chart: {
            height: 350,
            type: 'bar',
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: 'top', // top, center, bottom
              },
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val + '%';
            },
            offsetY: -20,
            style: {
              fontSize: '12px',
              colors: [this.themeColor()],
            },
          },

          xaxis: {
            categories: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            position: 'top',
            labels: {
              offsetY: -18,
              style: {
                colors: this.themeColor(),
              },
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            crosshairs: {
              fill: {
                type: 'gradient',
                gradient: {
                  colorFrom: '#D8E3F0',
                  colorTo: '#BED1E6',
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
                },
              },
            },
            tooltip: {
              enabled: true,
              offsetY: -35,
            },
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              type: 'horizontal',
              shadeIntensity: 0.25,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [50, 0, 100, 100],
            },
          },
          yaxis: {
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              formatter: function (val) {
                return val + '%';
              },
            },
          },
          title: {
            text: 'Monthly Inflation in Argentina, 2002',
            floating: false,
            offsetY: 330,
            align: 'center',
            style: {
              color: this.themeColor(),
            },
          },
        };

        this.chartOptionsSerie = {
          series: [44, 55, 13, 43, 22],
          chart: {
            width: 380,
            type: 'pie',
            toolbar: {
              show: false,
            },
          },
          labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        };
      }
    });
  }
}
