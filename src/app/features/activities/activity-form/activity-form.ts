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
  public activitiesService = inject(ActivitiesService);

  showSuccess = signal(false);
  showError = signal(false);
  editingId = signal<string | null>(null); // Check 16: ID de la actividad que editamos

  newActivity = {
    type: '',
    duration: 0,
    calories: 0,
    date: new Date().toISOString().split('T')[0]
  };

  /**
   * Carga los datos de una actividad existente en el formulario para editar
   */
  setEditMode(activity: Activity) {
    this.editingId.set(activity.id || null);
    this.newActivity = {
      type: activity.type,
      duration: activity.duration,
      calories: activity.calories,
      date: activity.date
    };
  }

  calculateCalories() {
    const type = this.newActivity.type.toLowerCase().trim();
    const mins = this.newActivity.duration;

    if (mins > 0 && type.length > 0) {
      let factor = 5; 
      if (type.includes('box') || type.includes('kick')) factor = 12;
      if (type.includes('cross') || type.includes('hiit')) factor = 11;
      if (type.includes('corr') || type.includes('run')) factor = 10;
      if (type.includes('fut') || type.includes('socc')) factor = 9;
      if (type.includes('balon') || type.includes('basket')) factor = 8.5;
      if (type.includes('tenis')) factor = 7.5;
      if (type.includes('padel')) factor = 6.5;
      if (type.includes('nad')) factor = 8;
      if (type.includes('bic') || type.includes('cycl')) factor = 7;
      if (type.includes('gym') || type.includes('pesa')) factor = 6;
      if (type.includes('yog') || type.includes('pila')) factor = 3;
      if (type.includes('cam') || type.includes('walk')) factor = 3.5;

      this.newActivity.calories = Math.round(mins * factor);
    } else {
      this.newActivity.calories = 0;
    }
  }

  save() {
    if (this.newActivity.type.trim() && this.newActivity.duration > 0) {
      const activityData: Activity = { ...this.newActivity, userId: 'session-user-123' };

      if (this.editingId()) {
        // Check 16: Actualizar registro existente
        this.activitiesService.updateActivity(this.editingId()!, activityData);
      } else {
        // Check 32: Crear nuevo registro
        this.activitiesService.addActivity(activityData);
      }
      
      this.showSuccess.set(true);
      this.showError.set(false);
      setTimeout(() => this.showSuccess.set(false), 3000);
      this.cancelEdit();
    } else {
      this.showError.set(true);
    }
  }

  cancelEdit() {
    this.editingId.set(null);
    this.resetForm();
  }

  private resetForm() {
    this.newActivity = { 
      type: '', duration: 0, calories: 0,
      date: new Date().toISOString().split('T')[0] 
    };
  }
}