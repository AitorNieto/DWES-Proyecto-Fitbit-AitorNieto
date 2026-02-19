import { Component, inject, signal, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivitiesService } from '../../../core/services/activities';
import { AuthService } from '../../../core/services/auth.service';
import { Activity } from '../models/activity.model';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.scss'
})
export class ActivityList {
  public activitiesService = inject(ActivitiesService);
  public authService = inject(AuthService);

  @Input() activityForm: any; 

  searchTerm = signal<string>('');

  filteredActivities = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allActivities = this.activitiesService.activities();
    if (!term) return allActivities;
    return allActivities.filter(a => 
      a.type.toLowerCase().includes(term) || a.date.includes(term)
    );
  });

  onDelete(id: string | undefined) {
    // Si el ID existe y el usuario confirma, procedemos al borrado
    if (id && confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      this.activitiesService.deleteActivity(id);
    }
  }

  onEdit(activity: Activity) {
    if (this.activityForm) {
      this.activityForm.setEditMode(activity);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}