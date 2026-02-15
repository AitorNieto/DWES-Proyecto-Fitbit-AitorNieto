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
  
  // URL oficial de Fitbit para obtener la lista de actividades
  private apiUrl = 'https://api.fitbit.com/1/user/-/activities/list.json'; 

  public loading = signal<boolean>(false);
  // Cargar actividades guardadas en localStorage al iniciar
  private activitiesList = signal<Activity[]>(this.loadActivitiesFromStorage());

  // Exponemos la lista como solo lectura para los componentes
  activities = this.activitiesList.asReadonly();

  /**
   * Carga las actividades desde localStorage
   */
  private loadActivitiesFromStorage(): Activity[] {
    try {
      const saved = localStorage.getItem('activities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  /**
   * Guarda las actividades en localStorage
   */
  private saveActivitiesToStorage(): void {
    localStorage.setItem('activities', JSON.stringify(this.activitiesList()));
  }

  /**
   * Obtiene las actividades reales desde Fitbit
   */
  getActivities() {
    this.loading.set(true);

    // Parámetros requeridos por Fitbit (ajustamos fecha al día de hoy)
    const queryParams = '?beforeDate=2026-02-13&offset=0&limit=20&sort=desc';

    this.http.get<any>(`${this.apiUrl}${queryParams}`).pipe(
      map(response => {
        // Transformamos el formato de Fitbit a tu modelo Activity
        return response.activities.map((f: any) => ({
          id: f.logId.toString(),
          type: f.activityName,
          duration: Math.round(f.duration / 60000), // Fitbit usa milisegundos
          calories: f.calories,
          date: f.startTime.split('T')[0],
          userId: 'fitbit-user'
        }));
      }),
      catchError(error => {
        console.error('Error al conectar con la API de Fitbit:', error);
        // Si falla Fitbit, devolvemos las actividades guardadas en localStorage
        const savedActivities = this.loadActivitiesFromStorage();
        return of(savedActivities); 
      }),
      finalize(() => this.loading.set(false))
    ).subscribe(mappedData => {
      this.activitiesList.set(mappedData);
      this.saveActivitiesToStorage();
    });
  }

  /**
   * Añade una actividad a Fitbit (formato URL encoded según su documentación)
   */
  addActivity(activity: Activity) {
    this.loading.set(true);
    
    // Fitbit requiere que los datos se envíen como formulario
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
          // Agregar la actividad localmente con un ID temporal
          const newActivity: Activity = {
            ...activity,
            id: response.logId?.toString() || Math.random().toString(36).substr(2, 9)
          };
          
          // Actualizar la lista local añadiendo la nueva actividad
          this.activitiesList.update(list => [newActivity, ...list]);
          // Guardar en localStorage
          this.saveActivitiesToStorage();
          
          console.log('Actividad agregada exitosamente');
        },
        error: (err) => console.error('Error al registrar actividad en Fitbit:', err)
      });
  }

  /**
   * Borra una actividad de Fitbit usando su logId
   */
  deleteActivity(id: string) {
    this.loading.set(true);
    const deleteUrl = `https://api.fitbit.com/1/user/-/activities/${id}.json`;

    this.http.delete(deleteUrl).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        // Actualizamos la lista local eliminando el ID borrado
        this.activitiesList.update(list => list.filter(a => a.id !== id));
        // Guardar en localStorage
        this.saveActivitiesToStorage();
      },
      error: (err) => console.error('Error al eliminar actividad:', err)
    });
  }
}