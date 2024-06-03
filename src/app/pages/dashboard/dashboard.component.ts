import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud } from '../../models/Solicitud';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ModalComponent } from '../modal/modal.component';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ButtonModule, CommonModule, TableModule, InputIconModule, IconFieldModule, 
    ModalComponent, InputTextModule, DropdownModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public listaSolicitudes: Solicitud[] = [];
  private intervalo: any;
  public filteredSolicitudes: Solicitud[] = [];
  loading: boolean = true;

  solicitudParaActualizar: Solicitud | null = null;
  estadoParaActualizar: string = '';
  mostrarModal: boolean = false;

  statuses: any[];
  activityValues: number[] = [0, 100];
  globalFilter: string = '';

  constructor(private http: HttpClient, private router: Router, private solicitudServicio: SolicitudService) { 
    this.statuses = [
      { label: 'Aprobada', value: 'aprobada' },
      { label: 'Rechazada', value: 'rechazada' },
      { label: 'Pendiente', value: 'pendiente' }
    ];
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('estaEsLaKey');

      //Si no tenemos token, no podemos acceder a la página y nos redirigirá al login
      if (!token) {
        this.router.navigateByUrl('/login');
      } else {
        this.obtenerSolicitudesNoAceptadas();
        this.loading = false;
        //Consultamos cada 10 segundos si han entrado nuevas peticiones:
        this.intervalo = setInterval(() => this.obtenerSolicitudesNoAceptadas(), 10000);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  obtenerSolicitudesNoAceptadas() {
    this.solicitudServicio.obtenerSolicitudesNoAceptadas().subscribe({
      next: (data) => {
        console.log(data);
        this.listaSolicitudes = data;
        this.aplicarFiltro(); 
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  actualizarEstado(solicitud: Solicitud, estado: string) {
    this.solicitudParaActualizar = solicitud;
    this.estadoParaActualizar = estado;
    this.mostrarModal = true;
  }

  confirmarActualizacion() {
    if (this.solicitudParaActualizar && this.solicitudParaActualizar.solicitudID !== undefined) {
      const precioActualizado = false; 
      this.solicitudServicio.actualizarEstadoSolicitud(this.solicitudParaActualizar.solicitudID, this.estadoParaActualizar, precioActualizado).subscribe({
        next: () => {
          this.solicitudParaActualizar!.estado = this.estadoParaActualizar;
          // Actualizamos el componente al cambiar un estado:
          this.obtenerSolicitudesNoAceptadas();
          this.mostrarModal = false;
        },
        error: (err) => {
          console.log(err.message);
          this.mostrarModal = false;
        }
      });
    } else {
      console.error('solicitudID es undefined');
      this.mostrarModal = false;
    }
  }
  

  cancelarActualizacion() {
    this.solicitudParaActualizar = null;
    this.estadoParaActualizar = '';
    this.mostrarModal = false;
  }

  onFilterChange(event: any) {
    this.globalFilter = event.target.value.toLowerCase();
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.globalFilter) {
      this.filteredSolicitudes = this.listaSolicitudes.filter(solicitud => 
        (solicitud.solicitudID?.toString().toLowerCase().includes(this.globalFilter) ?? false) ||
        (solicitud.sucursal?.nombreSucursal?.toLowerCase().includes(this.globalFilter) ?? false) ||
        (solicitud.sucursal?.ubicacion?.toLowerCase().includes(this.globalFilter) ?? false) ||
        (solicitud.vehiculo?.marca?.toLowerCase().includes(this.globalFilter) ?? false) ||
        (solicitud.vehiculo?.modelo?.toLowerCase().includes(this.globalFilter) ?? false) ||
        (solicitud.vehiculo?.anio?.toString().toLowerCase().includes(this.globalFilter) ?? false) ||
        (solicitud.vehiculo?.precio?.toString().toLowerCase().includes(this.globalFilter) ?? false)
      );
    } else {
      this.filteredSolicitudes = this.listaSolicitudes;
    }
  }
}
