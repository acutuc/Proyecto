import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { VehiculoService } from '../../services/vehiculo.service';
import { Vehiculo } from '../../models/Vehiculo'
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.css'
})
export class VehiculosComponent implements OnInit {
  public listaVehiculos: Vehiculo[] = [];

  constructor(private vehiculoServicio: VehiculoService, private router: Router) {
    
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('estaEsLaKey');

      //Si no tenemos token, no podemos acceder a la página y nos redirigirá al login:
      if (!token) {
        this.router.navigateByUrl('/login')
      }
      this.obtenerVehiculos();
    }
  }

  obtenerVehiculos() {
    this.vehiculoServicio.obtenerVehiculos().subscribe({
      next: (data) => {
        this.listaVehiculos = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  /*
  nuevo() {
    this.router.navigate(['/vehiculo', 0]);
  }
  */

  editar(objeto: Vehiculo) {
    this.router.navigate(['/vehiculo', objeto.vehiculoID]);
  }

  eliminar(objeto: Vehiculo) {
    if (confirm(`¿Desea eliminar el vehículo ${objeto.marca} ${objeto.modelo}?`)) {
      this.vehiculoServicio.borrarVehiculo(objeto.vehiculoID).subscribe({
        next: () => {
          this.listaVehiculos = this.listaVehiculos.filter(v => v.vehiculoID !== objeto.vehiculoID);
          alert('Vehículo eliminado correctamente.');
        },
        error: (err) => {
          console.log(err.message);
          alert('No se pudo eliminar el vehículo.');
        }
      });
    }
  }
}
