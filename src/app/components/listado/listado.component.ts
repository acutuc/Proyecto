import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent {
  @Input() username = '';
  listado = [
    {
      id: 1,
      nombre: "Persona 1"
    },
    {
      id: 2,
      nombre: "Persona 2"
    },
    {
      id: 3,
      nombre: "Persona 3"
    },
    { 
      id: 4,
      nombre: "Persona 4"
    },
    { 
      id: 5,
      nombre: "Persona 5"
    }
  ]
}
