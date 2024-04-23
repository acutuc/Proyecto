import { Component, OnInit, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { VehiculoService } from '../../services/vehiculo.service';
import { Vehiculo } from '../../models/Vehiculo';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent implements OnInit {
  public listaVehiculos: Vehiculo[] = [];
  public mostrarColumnas: any[];

  constructor(
    private vehiculoServicio: VehiculoService,
    private router: Router
  ) {
    this.mostrarColumnas = [
      { field: 'vehiculoID', header: 'ID Vehículo' },
      { field: 'sucursalID', header: 'ID Sucursal' },
      { field: 'marca', header: 'Marca' },
      { field: 'modelo', header: 'Modelo' },
      { field: 'anio', header: 'Año' },
      { field: 'precio', header: 'Precio' },
      { field: 'disponibilidad', header: 'Disponibilidad' },
      { field: 'accion', header: "" }
    ];
  }

  ngOnInit(): void {
    this.obtenerVehiculos();
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

  nuevo() {
    this.router.navigate(['/vehiculo', 0]);
  }

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
