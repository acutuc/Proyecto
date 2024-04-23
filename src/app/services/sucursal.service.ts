import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Sucursal } from '../models/Sucursal';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  private apiUrl: string = appsettings.apiUrl + "Sucursal";

  constructor(private http: HttpClient) { }

  obtenerSucursales() {
    return this.http.get<Sucursal[]>(this.apiUrl);
  }

  obtenerSucursal(id: number) {
    return this.http.get<Sucursal>(`${this.apiUrl}/${id}`);
  }

  crearSucursal(objeto: Sucursal) {
    return this.http.post<Sucursal>(this.apiUrl, objeto);
  }

  borrarSucursal(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  actualizarSucursal(id: number, objeto: Sucursal) {
    return this.http.put(`${this.apiUrl}/${id}`, objeto);
  }
}
