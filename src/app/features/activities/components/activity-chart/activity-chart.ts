import { Component, inject, ElementRef, ViewChild, effect, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ActivitiesService } from '../../../../core/services/activities';

Chart.register(...registerables);

@Component({
  selector: 'app-activity-chart',
  standalone: true,
  templateUrl: './activity-chart.html',
  styleUrl: './activity-chart.scss'
})
export class ActivityChart implements AfterViewInit {
  @ViewChild('activityCanvas') private chartRef!: ElementRef;
  private activitiesService = inject(ActivitiesService);
  private chart: any;

  constructor() {
    // Escucha cambios en las señales de actividades (Check 34)
    effect(() => {
      const data = this.activitiesService.activities();
      if (data.length > 0 && this.chart) {
        this.updateChart(data);
      }
    });
  }

  ngAfterViewInit() {
    this.initChart();
  }

  private initChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    
    // Creamos el degradado sutil
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 178, 178, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 178, 178, 0)');

    this.chart = new Chart(ctx, {
      type: 'line', // Estilo moderno de línea
      data: {
        labels: [],
        datasets: [{
          label: 'Calorías quemadas',
          data: [],
          borderColor: '#00b2b2', // Tu color de marca
          backgroundColor: gradient,
          fill: true,
          tension: 0.4, // Curva suavizada
          pointRadius: 4,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#00b2b2',
          pointHoverRadius: 6,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false } // Limpieza visual
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
  }

  private updateChart(activities: any[]) {
    // Invertimos para que la fecha más reciente esté a la derecha
    const sorted = [...activities].reverse(); 
    this.chart.data.labels = sorted.map(a => a.date);
    this.chart.data.datasets[0].data = sorted.map(a => a.calories);
    this.chart.update();
  }
}