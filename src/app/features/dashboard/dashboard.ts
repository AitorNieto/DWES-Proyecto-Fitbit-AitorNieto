import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class Dashboard implements OnInit {
  public authService = inject(AuthService);
  private activitiesService = inject(ActivitiesService);

  ngOnInit(): void {
    // Verificamos sesión y cargamos datos
    if (this.authService.isLoggedIn()) {
      this.activitiesService.getActivities();
    }
  }
}