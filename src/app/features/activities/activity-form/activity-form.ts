import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivitiesService } from '../../../core/services/activities';
import { Activity } from '../models/activity.model';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './activity-form.html',
  styleUrl: './activity-form.scss'
})
export class ActivityForm {
  // CAMBIO: De private a public para que el HTML pueda acceder (Check 29)
  public activitiesService = inject(ActivitiesService);

  showSuccess = signal(false);

  newActivity = {
    type: '',
    duration: 0,
    date: new Date().toISOString().split('T')[0]
  };

  save() {
    if (this.newActivity.type.trim() && this.newActivity.duration > 0) {
      const activityData: Activity = {
        type: this.newActivity.type,
        duration: this.newActivity.duration,
        calories: this.newActivity.duration * 5,
        date: this.newActivity.date,
        userId: 'session-user-123'
      };

      this.activitiesService.addActivity(activityData);
      
      // Feedback visual de éxito
      this.showSuccess.set(true);
      setTimeout(() => this.showSuccess.set(false), 3000);
      
      this.resetForm();
    }
  }

  private resetForm() {
    this.newActivity = { 
      type: '', 
      duration: 0, 
      date: new Date().toISOString().split('T')[0] 
    };
  }
}