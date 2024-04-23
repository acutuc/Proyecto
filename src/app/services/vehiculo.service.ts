import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Vehiculo } from '../models/Vehiculo';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  private apiUrl: string = appsettings.apiUrl + "Vehiculo";

  constructor(private http: HttpClient) { }

  obtenerVehiculos() {
    return this.http.get<Vehiculo[]>(this.apiUrl);
  }

  obtenerVehiculo(id: number) {
    return this.http.get<Vehiculo>(`${this.apiUrl}/${id}`);
  }

  crearVehiculo(objeto: Vehiculo) {
    return this.http.post<Vehiculo>(this.apiUrl, objeto);
  }

  borrarVehiculo(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  actualizarVehiculo(id: number, objeto: any) {
    return this.http.put(`${this.apiUrl}/${id}`, objeto);
  }
}
