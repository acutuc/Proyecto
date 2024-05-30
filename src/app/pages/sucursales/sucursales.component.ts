import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SucursalService } from '../../services/sucursal.service';
import { Sucursal } from '../../models/Sucursal';
import { Router } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, IconFieldModule, InputTextModule, InputIconModule],
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.css'
})
export class SucursalesComponent implements OnInit {
  public listaSucursales: Sucursal[] = [];
  public mostrarColumnas: any[];
  public filteredSucursales: Sucursal[] = [];
  globalFilter: string = '';

  constructor(private sucursalServicio: SucursalService, private router: Router) {
    this.mostrarColumnas = [
      { field: 'sucursalID', header: 'ID Sucursal' },
      {field:'usuarioID', header: 'ID Usuario'},
      { field: 'nombreSucursal', header: 'Nombre' },
      { field: 'ubicacion', header: 'Ubicación' },
      { field: 'accion', header: "" }
    ];
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('estaEsLaKey');

      //Si no tenemos token, no podemos acceder a la página y nos redirigirá al login
      if (!token) {
        this.router.navigateByUrl('/login')
      }
      this.obtenerSucursales();
    }
  }

  obtenerSucursales() {
    this.sucursalServicio.obtenerSucursales().subscribe({
      next: (data) => {
        this.listaSucursales = data;
        this.filteredSucursales = data;
        this.aplicarFiltro();
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  onFilterChange(event: any) {
    this.globalFilter = event.target.value.toLowerCase();
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.globalFilter) {
      this.filteredSucursales = this.listaSucursales.filter(sucursal =>
        (sucursal.sucursalID?.toString().toLowerCase().includes(this.globalFilter) ?? false) ||
        (sucursal.usuarioID?.toString().includes(this.globalFilter) ?? false) ||
        (sucursal.nombreSucursal?.toLowerCase().includes(this.globalFilter) ?? false) ||
        (sucursal.ubicacion?.toString().includes(this.globalFilter) ?? false)
      );
    } else {
      this.filteredSucursales = this.listaSucursales;
    }
  }

  nuevaSucursal() {
    this.router.navigate(['/sucursal', 0]);
  }

  editarSucursal(objeto: Sucursal) {
    this.router.navigate(['/sucursal', objeto.sucursalID]);
  }

  eliminarSucursal(objeto: Sucursal) {
    if (confirm(`¿Desea eliminar la sucursal ${objeto.nombreSucursal}?`)) {
      this.sucursalServicio.borrarSucursal(objeto.sucursalID).subscribe({
        next: () => {
          this.listaSucursales = this.listaSucursales.filter(s => s.sucursalID !== objeto.sucursalID);
          this.filteredSucursales = this.filteredSucursales.filter(s => s.sucursalID !== objeto.sucursalID);
          alert('Sucursal eliminada correctamente.');
        },
        error: (err) => {
          console.log(err.message);
          alert('No se pudo eliminar la sucursal.');
        }
      });
    }
  }
}
