import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesService } from '../../../core/services/activities';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <h2>Panel de Control (Sólo Administradores)</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <span>Total Actividades</span>
          <strong>{{ activitiesService.activities().length }}</strong>
        </div>
      </div>
      <p>Desde aquí podrás gestionar todos los registros del sistema.</p>
    </div>
  `,
  styles: [`
    .admin-container { padding: 20px; }
    .stat-card { 
      background: #f1f5f9; 
      padding: 20px; 
      border-radius: 8px; 
      border-left: 5px solid #00b2b2;
      display: flex; 
      flex-direction: column;
    }
  `]
})
export class AdminPanel {
  public activitiesService = inject(ActivitiesService);
}