import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, ButtonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})

export class LayoutComponent implements OnInit {
  usuarioLogueado: any;

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    if (typeof localStorage !== "undefined") {
      //Obtenemos los datos del usuario logueado:
      const usuarioLogueadoString = localStorage.getItem('usuarioLogueado');

      if (usuarioLogueadoString) {
        this.usuarioLogueado = JSON.parse(usuarioLogueadoString);
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

}
