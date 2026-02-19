import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router'; // <--- AÑADIDO RouterLinkActive
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // <--- AÑADIDO RouterLinkActive aquí también
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  // Public para que la plantilla HTML pueda acceder a los métodos (Check 21)
  public authService = inject(AuthService);
}