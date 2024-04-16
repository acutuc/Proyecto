import { Component } from '@angular/core';
import { ListadoComponent } from '../listado/listado.component';
import { ButtonModule } from 'primeng/button';
import { AllVehiclesComponent } from '../all-vehicles/all-vehicles.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ListadoComponent, ListadoComponent, AllVehiclesComponent, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  nombreUsuario = 'acutuc';
  logueado = false;
  greet(){
    alert(`Foto de ${this.nombreUsuario}`)
  }
}
