import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesService } from '../../../core/services/activities';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.scss'
})
export class ActivityList {
  // Inyectamos el servicio para acceder a los datos
  public activitiesService = inject(ActivitiesService);

  onDelete(id: string | undefined) {
    if (id && confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      this.activitiesService.deleteActivity(id);
    }
  }
}