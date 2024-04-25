import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SucursalService } from '../../services/sucursal.service';
import { Sucursal } from '../../models/Sucursal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule],
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.css'
})
export class SucursalesComponent implements OnInit {
  public listaSucursales: Sucursal[] = [];
  public mostrarColumnas: any[];

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
      },
      error: (err) => {
        console.log(err.message);
      }
    });
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
