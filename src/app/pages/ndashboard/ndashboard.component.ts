import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-ndashboard',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './ndashboard.component.html',
  styleUrls: ['./ndashboard.component.css']
})
export class NdashboardComponent implements OnInit {
  sucursales: any[] = [];

  constructor(
    private usuarioService: UsuarioService, 
    private router: Router, 
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const token = this.localStorageService.getItem('estaEsLaKey');

    //Si no tenemos token, no podemos acceder a la página y nos redirigirá al login
    if (!token) {
      this.router.navigateByUrl('/login');
    }

    const usuarioLogueado = this.localStorageService.getItem('usuarioLogueado');

    if (usuarioLogueado) {
      const usuarioID = JSON.parse(usuarioLogueado).usuarioID;

      this.usuarioService.obtenerSucursalesPorUsuario(usuarioID).subscribe(
        (data: any) => {
          this.sucursales = data;
        },
        (error) => {
          console.error('Error obteniendo las sucursales:', error);
        }
      );
    } else {
      console.error('No se encontró usuario logueado en localStorage');
    }
  }

  verVehiculos(sucursalID: number) {
    this.router.navigate(['/vehiculos-en-sucursal', sucursalID]);
  }
}
