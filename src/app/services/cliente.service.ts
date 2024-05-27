import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../models/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl: string = appsettings.apiUrl + "Cliente";

  constructor(private http: HttpClient) { }

  obtenerClientes() {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  obtenerCliente(id: number) {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  crearCliente(objeto: Cliente) {
    return this.http.post<Cliente>(this.apiUrl, objeto);
  }

  borrarCliente(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  actualizarCliente(id: number, objeto: any) {
    return this.http.put(`${this.apiUrl}/${id}`, objeto);
  }

  //Devolvemos boolean para saber si un cliente existe mediante su DNI:
  verificarCliente(dni: string) {
    console.log()
    return this.http.get<boolean>(`${this.apiUrl}/Existe/${dni}`);
  }

  //Obtenemos el ID de un cliente a través de su DNI:
  obtenerClientePorDni(dni: string) {
    return this.http.get<Cliente>(`${this.apiUrl}/PorDni/${dni}`);
  }
}
