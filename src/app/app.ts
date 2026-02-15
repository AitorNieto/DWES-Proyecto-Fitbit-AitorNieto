import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar'; // Importa la clase Navbar

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    Navbar // Añade la clase aquí para que el HTML la reconozca
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('FitBit');
}