import { Component, OnInit, inject, AfterViewInit, effect } from '@angular/core'; // Añadimos effect
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActivityList } from '../activities/activity-list/activity-list';
import { ActivityForm } from '../activities/activity-form/activity-form';
import { ActivitiesService } from '../../core/services/activities'; 
import { AuthService } from '../../core/services/auth.service';
import { ActivityChart } from '../activities/components/activity-chart/activity-chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ActivityList, ActivityForm, ActivityChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, AfterViewInit {
  public authService = inject(AuthService);
  private activitiesService = inject(ActivitiesService);
  private route = inject(ActivatedRoute);

  constructor() {
    // Usamos un effect para detectar cuando las actividades se cargan (Check 34)
    effect(() => {
      const activities = this.activitiesService.activities();
      const fragment = this.route.snapshot.fragment;
      
      if (activities.length > 0 && fragment === 'listado') {
        this.scrollToList();
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.activitiesService.getActivities();
    }
  }

  ngAfterViewInit(): void {
    // Intento inicial por si ya hay datos en cache
    this.scrollToList();
  }

  private scrollToList() {
    const frag = this.route.snapshot.fragment;
    if (frag === 'listado') {
      setTimeout(() => {
        const element = document.getElementById('listado');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300); // Aumentamos un poco el tiempo para asegurar el render
    }
  }
}