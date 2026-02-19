import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // Añadido para navegación

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink], // Necesario para el botón de volver
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  // Check 11: Página de error 404
}