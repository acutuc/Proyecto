import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { VehiculoService } from '../../services/vehiculo.service';
import { Vehiculo } from '../../models/Vehiculo';
import { Router } from '@angular/router';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, InputIconModule, IconFieldModule, InputTextModule],
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {
  public listaVehiculos: Vehiculo[] = [];
  public filteredVehiculos: Vehiculo[] = [];
  globalFilter: string = '';

  constructor(private vehiculoServicio: VehiculoService, private router: Router) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('estaEsLaKey');

      //Si no tenemos token, no podemos acceder a la página y nos redirigirá al login:
      if (!token) {
        this.router.navigateByUrl('/login');
        return;
      }
      this.obtenerVehiculos();
    }
  }

  obtenerVehiculos() {
    this.vehiculoServicio.obtenerVehiculos().subscribe({
      next: (data) => {
        this.listaVehiculos = data;
        this.filteredVehiculos = data;
        this.aplicarFiltro();
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  editar(objeto: Vehiculo) {
    this.router.navigate(['/vehiculo', objeto.vehiculoID]);
  }

  eliminar(objeto: Vehiculo) {
    if (confirm(`¿Desea eliminar el vehículo ${objeto.marca} ${objeto.modelo}?`)) {
      this.vehiculoServicio.borrarVehiculo(objeto.vehiculoID).subscribe({
        next: () => {
          this.listaVehiculos = this.listaVehiculos.filter(v => v.vehiculoID !== objeto.vehiculoID);
          this.filteredVehiculos = this.filteredVehiculos.filter(v => v.vehiculoID !== objeto.vehiculoID);
          alert('Vehículo eliminado correctamente.');
        },
        error: (err) => {
          console.log(err.message);
          alert('No se pudo eliminar el vehículo.');
        }
      });
    }
  }

  onFilterChange(event: any) {
    this.globalFilter = event.target.value.toLowerCase();
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.globalFilter) {
      this.filteredVehiculos = this.listaVehiculos.filter(vehiculo =>
        (vehiculo.vehiculoID?.toString().toLowerCase().includes(this.globalFilter) ?? false) ||
        (vehiculo.marca?.toLowerCase().includes(this.globalFilter) ?? false) ||
        (vehiculo.modelo?.toLowerCase().includes(this.globalFilter) ?? false) ||
        (vehiculo.anio?.toString().includes(this.globalFilter) ?? false) ||
        (vehiculo.precio?.toString().includes(this.globalFilter) ?? false)
      );
    } else {
      this.filteredVehiculos = this.listaVehiculos;
    }
  }
}
