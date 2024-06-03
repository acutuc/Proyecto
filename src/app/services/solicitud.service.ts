import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Solicitud } from '../models/Solicitud';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private apiUrl: string = appsettings.apiUrl + "Solicitud";

  constructor(private http: HttpClient) { }

  obtenerSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl);
  }

  obtenerSolicitudesNoAceptadas(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/NoAceptadasCompletas`);
  }

  obtenerSolicitud(id: number): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${this.apiUrl}/${id}`);
  }

  crearSolicitud(objeto: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.apiUrl, objeto);
  }

  borrarSolicitud(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarSolicitud(id: number, objeto: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, objeto);
  }

  //Actualiza el ESTADO de la solicitud:
actualizarEstadoSolicitud(id: number, estado: string, precioActualizado: boolean): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${id}`, { estado, precioActualizado });
}


  //Obtenemos una solicitud por el vehiculoID:
  obtenerSolicitudPorVehiculoId(vehiculoID: number): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${this.apiUrl}/ByVehiculoId/${vehiculoID}`);
  }

  actualizarEstadoYClienteSolicitud(vehiculoID: number, estado: string, clienteID: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UpdateByVehiculoId/${vehiculoID}`, { estado, clienteID });
  }
}
