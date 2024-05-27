import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, ButtonModule, CommonModule, TabMenuModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})

export class LayoutComponent implements OnInit {
  usuarioLogueado: any;
  botonVolver = true;
  tipoUsuarioLogueado: any;
  items: MenuItem[] | undefined;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.botonVolver = (this.router.url !== '/dashboard' && this.router.url !== "/ndashboard");
    });
  }

  ngOnInit(): void {
    if (typeof localStorage !== "undefined") {
      const usuarioLogueadoString = localStorage.getItem('usuarioLogueado');
      if (usuarioLogueadoString) {
        this.usuarioLogueado = JSON.parse(usuarioLogueadoString).nombreUsuario;
        this.tipoUsuarioLogueado = JSON.parse(usuarioLogueadoString).tipoUsuario;
      } else {
        this.router.navigate(['/login']);
      }

      if (this.tipoUsuarioLogueado === "admin") {
        this.items = [
          { label: 'Dashboard', icon: 'pi pi-home', command: () => this.volver() },
          { label: 'Vehículos', icon: 'pi pi-car', command: () => this.vehiculos() },
          { label: 'Sucursales', icon: 'pi pi-building', command: () => this.sucursales() },
          { label: 'Usuarios', icon: 'pi pi-users', command: () => this.usuarios() },
          { label: 'Salir', icon: 'pi pi-sign-out', command: () => this.logout(), styleClass: 'menu-item-salir'}
        ];
      } else {
        this.items = [
          { label: 'Dashboard', icon: 'pi pi-home', command: () => this.volver(), styleClass: 'menu-item-dashboard-normal' },
          { label: 'Salir', icon: 'pi pi-sign-out', command: () => this.logout(), styleClass: 'menu-item-salir' }
        ];
      }
    }
  }

  logout() {
    localStorage.removeItem('estaEsLaKey');
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/login']);
  }

  volver() {
    if (this.tipoUsuarioLogueado !== "admin") {
      this.router.navigate(['/ndashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  vehiculos() {
    this.router.navigateByUrl('/vehiculos');
  }

  sucursales() {
    this.router.navigateByUrl('/sucursales');
  }

  usuarios() {
    this.router.navigateByUrl('/usuarios');
  }
}
