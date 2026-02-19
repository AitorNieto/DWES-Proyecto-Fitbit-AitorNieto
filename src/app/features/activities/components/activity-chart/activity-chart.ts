import { Component, OnInit, inject, ElementRef, ViewChild, effect } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ActivitiesService } from '../../../../core/services/activities';

Chart.register(...registerables);

@Component({
  selector: 'app-activity-chart',
  standalone: true,
  template: `<canvas #activityCanvas></canvas>`,
  styles: [`canvas { max-height: 400px; width: 100%; }`]
})
export class ActivityChart implements OnInit {
  @ViewChild('activityCanvas') private chartRef!: ElementRef;
  private activitiesService = inject(ActivitiesService);
  private chart: any;

  constructor() {
    // Usamos un effect para que el gráfico se actualice solo cuando cambien los datos de Fitbit
    effect(() => {
      const data = this.activitiesService.activities();
      if (data.length > 0) {
        this.updateChart(data);
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initChart();
  }

  private initChart() {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar', // Puede ser 'line', 'bar', 'doughnut'...
      data: {
        labels: [],
        datasets: [{
          label: 'Calorías quemadas',
          data: [],
          backgroundColor: '#3b82f6',
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  private updateChart(activities: any[]) {
    if (!this.chart) return;

    // Mapeamos los datos del servicio para el gráfico
    this.chart.data.labels = activities.map(a => a.date);
    this.chart.data.datasets[0].data = activities.map(a => a.calories);
    this.chart.update();
  }
}