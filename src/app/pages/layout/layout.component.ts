import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, ButtonModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})

export class LayoutComponent implements OnInit {
  usuarioLogueado: any;
  botonVolver = true;
  tipoUsuarioLogueado: any;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.botonVolver = (this.router.url !== '/dashboard' && this.router.url !== "/ndashboard");
    });
  }

  ngOnInit(): void {
    if (typeof localStorage !== "undefined") {
      //Obtenemos los datos del usuario logueado:
      const usuarioLogueadoString = localStorage.getItem('usuarioLogueado');

      if (usuarioLogueadoString) {
        //Obtenemos el nombre del usuario:
        this.usuarioLogueado = JSON.parse(usuarioLogueadoString).nombreUsuario;
        //Obtenemos el tipo de usuario:
        this.tipoUsuarioLogueado = JSON.parse(usuarioLogueadoString).tipoUsuario;
      } else {
        // Si no hay usuario logueado, redirigir al componente de login
        this.router.navigate(['/login']);
      }
    }
  }

  logout() {
    //Eliminamos los datos del usuario del almacenamiento local:
    localStorage.removeItem('estaEsLaKey');
    localStorage.removeItem('usuarioLogueado');

    //Redirigimos al usuario a la página de login:
    this.router.navigate(['/login']);
  }

  volver() {

    if(this.tipoUsuarioLogueado !== "admin"){
      this.router.navigate(['/ndashboard']);
    }else{
      this.router.navigate(['/dashboard']);
    }
    
  }

}
