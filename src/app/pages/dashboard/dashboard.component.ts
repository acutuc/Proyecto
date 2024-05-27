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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule, CommonModule, TableModule, InputIconModule, IconFieldModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public listaSolicitudes: Solicitud[] = [];
  private intervalo: any;
  loading: boolean = true;

  constructor(private http: HttpClient, private router: Router, private solicitudServicio: SolicitudService) { }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('estaEsLaKey');

      // Si no tenemos token, no podemos acceder a la página y nos redirigirá al login
      if (!token) {
        this.router.navigateByUrl('/login');
      } else {
        this.obtenerSolicitudesNoAceptadas();
        this.loading = false;
        // Consultamos cada 10 segundos si han entrado nuevas peticiones:
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
        console.log(data)
        this.listaSolicitudes = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  actualizarEstado(solicitud: Solicitud, estado: string) {
    if (solicitud.solicitudID !== undefined) {
      this.solicitudServicio.actualizarEstadoSolicitud(solicitud.solicitudID!, estado).subscribe({
        next: () => {
          solicitud.estado = estado;
          // Actualizamos el componente al cambiar un estado:
          this.obtenerSolicitudesNoAceptadas();
        },
        error: (err) => {
          console.log(err.message);
        }
      });
    } else {
      console.error('solicitudID es undefined');
    }
  }
}
