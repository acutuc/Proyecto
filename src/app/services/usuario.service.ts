import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl: string = appsettings.apiUrl + "Usuario";

  constructor(private http: HttpClient) { }

  obtenerUsuarios() {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerUsuario(id: number) {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crearUsuario(objeto: Usuario) {
    return this.http.post<Usuario>(this.apiUrl, objeto);
  }

  borrarUsuario(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  actualizarUsuario(id: number, objeto: any) {
    return this.http.put(`${this.apiUrl}/${id}`, objeto);
  }

  obtenerSucursalesPorUsuario(usuarioID: number){
    return this.http.get(`${this.apiUrl}/${usuarioID}/sucursales`);
  }
}
