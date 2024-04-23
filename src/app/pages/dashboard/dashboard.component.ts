import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {


  constructor(private http: HttpClient, private router: Router) {

  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('estaEsLaKey');

      //Si no tenemos token, no podemos acceder a la página y nos redirigirá al login
      if (!token) {
        this.router.navigateByUrl('/login')
      }
      
    }

    //PRUEBA
    //this.obtenerUsuarios();
  }

  //Método que en el evento click, nos redirige a /vehiculos:
  vehiculos(){
    this.router.navigateByUrl('/vehiculos');
  }

  //Método que en el evento click, nos redirige a /sucursales:
  sucursales(){
    this.router.navigateByUrl('/sucursales');
  }

  ////Método que en el evento click, nos redirige a /usuarios:
  usuarios(){
    this.router.navigateByUrl('/usuarios');
  }

  obtenerUsuarios() {
    this.http.get('https://localhost:7259/api/Usuario').subscribe(
      (res: any) => {
        this.usuarios = res.data;
      },
      error => {
        console.log('Error desde la api');
      }
    );
  }
}