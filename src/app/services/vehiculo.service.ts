import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  arpiUrl = "https://localhost:7259/api/Vehiculo";

  constructor(private http: HttpClient) { }

  obtenerVehiculos(){

  }

  obtenerVehiculo(){
    
  }

  crearVehiculo(){

  }

  borrarVehiculo(){

  }

  actualizarVehiculo(){

  }
}
