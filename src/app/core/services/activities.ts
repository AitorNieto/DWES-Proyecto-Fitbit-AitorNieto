import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Activity } from '../../features/activities/models/activity.model';
import { catchError, finalize, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.fitbit.com/1/user/-/activities/list.json'; 

  public loading = signal<boolean>(false);
  private activitiesList = signal<Activity[]>(this.loadActivitiesFromStorage());

  activities = this.activitiesList.asReadonly();

  private loadActivitiesFromStorage(): Activity[] {
    try {
      const saved = localStorage.getItem('activities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private saveActivitiesToStorage(): void {
    localStorage.setItem('activities', JSON.stringify(this.activitiesList()));
  }

  getActivities() {
    this.loading.set(true);
    const queryParams = '?beforeDate=2026-02-13&offset=0&limit=20&sort=desc';

    this.http.get<any>(`${this.apiUrl}${queryParams}`).pipe(
      map(response => {
        return response.activities.map((f: any) => ({
          id: f.logId.toString(),
          type: f.activityName,
          duration: Math.round(f.duration / 60000), 
          calories: f.calories,
          date: f.startTime.split('T')[0],
          userId: 'fitbit-user'
        }));
      }),
      catchError(error => {
        console.error('Error API Fitbit:', error);
        return of(this.loadActivitiesFromStorage()); 
      }),
      finalize(() => this.loading.set(false))
    ).subscribe(mappedData => {
      const localOnly = this.loadActivitiesFromStorage().filter(a => a.id && a.id.length > 15);
      this.activitiesList.set([...localOnly, ...mappedData]);
      this.saveActivitiesToStorage();
    });
  }

  addActivity(activity: Activity) {
    this.loading.set(true);
    const body = new URLSearchParams();
    body.set('activityName', activity.type);
    body.set('manualCalories', activity.calories.toString());
    body.set('startTime', '12:00:00'); 
    body.set('durationMillis', (activity.duration * 60000).toString());
    body.set('date', activity.date);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    this.http.post('https://api.fitbit.com/1/user/-/activities.json', body.toString(), { headers })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response: any) => {
          const newActivity: Activity = {
            ...activity,
            id: response.logId?.toString() || Math.random().toString(36).substr(2, 9)
          };
          this.activitiesList.update(list => [newActivity, ...list]);
          this.saveActivitiesToStorage();
        },
        error: () => {
          const newActivity: Activity = { ...activity, id: 'local-' + Date.now() };
          this.activitiesList.update(list => [newActivity, ...list]);
          this.saveActivitiesToStorage();
        }
      });
  }

  updateActivity(id: string, updatedData: Activity) {
    this.activitiesList.update(current => 
      current.map(act => act.id === id ? { ...updatedData, id } : act)
    );
    this.saveActivitiesToStorage();
  }

  deleteActivity(id: string | undefined) {
    if (!id) return; // Validación de seguridad para TypeScript

    // Borrado optimista: actualizamos la señal inmediatamente
    this.activitiesList.update(list => list.filter(a => a.id !== id));
    this.saveActivitiesToStorage();

    const deleteUrl = `https://api.fitbit.com/1/user/-/activities/${id}.json`;
    this.http.delete(deleteUrl).subscribe({
      next: () => console.log('Eliminado en Fitbit'),
      error: (err) => console.warn('Eliminado solo localmente', err)
    });
  }
}