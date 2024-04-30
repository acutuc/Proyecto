import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SucursalService } from '../../services/sucursal.service';

@Component({
  selector: 'app-vehiculos-en-sucursal',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './vehiculos-en-sucursal.component.html',
  styleUrl: './vehiculos-en-sucursal.component.css'
})
export class VehiculosEnSucursalComponent implements OnInit {
  vehiculos: any[] = [];

  constructor(private route: ActivatedRoute, private sucursalService: SucursalService, private router: Router) {

  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('estaEsLaKey');

      //Si no tenemos token, no podemos acceder a la página y nos redirigirá al login
      if (!token) {
        this.router.navigateByUrl('/login')
      }
      
    }
    // Obtener el ID de la sucursal de los parámetros de la ruta
    this.route.params.subscribe(params => {
      const sucursalID = +params['id'];
      
      // Llamar al servicio para obtener los vehículos de la sucursal
      this.sucursalService.obtenerVehiculosPorSucursal(sucursalID).subscribe(
        (data: any) => {
          this.vehiculos = data;
        },
        (error) => {
          console.error('Error obteniendo los vehículos:', error);
        }
      );
    });
  }

  solicitarCompraVehiculo() {
    this.router.navigate(['/solicitud-compra-vehiculo']);
  }

}
