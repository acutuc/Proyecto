import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/Usuario'
import { Router } from '@angular/router';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, InputIconModule, IconFieldModule, InputTextModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  public listaUsuarios: Usuario[] = [];
  public mostrarColumnas: any[];
  public filteredUsuarios: Usuario[] = [];
  private intervalo: any;
  globalFilter: string = '';

  constructor(private usuarioServicio: UsuarioService, private router: Router, private localStorageService: LocalStorageService) {
    this.mostrarColumnas = [
      { field: 'usuarioID', header: 'ID Usuario' },
      { field: 'nombreUsuario', header: 'Usuario' },
      { field: 'tipoUsuario', header: "Rol" },
      { field: 'accion', header: "" }
    ];
  }

  ngOnInit(): void {
    const token = this.localStorageService.getItem('estaEsLaKey');

    //Si no tenemos token, no podemos acceder a la página y nos redirigirá al login
    if (!token) {
      this.router.navigateByUrl('/login')
    }else{
      this.obtenerUsuarios();
      this.intervalo = setInterval(() => this.obtenerUsuarios(), 5000);
    }
    

  }

  obtenerUsuarios() {
    this.usuarioServicio.obtenerUsuarios().subscribe({
      next: (data) => {
        this.listaUsuarios = data;
        this.filteredUsuarios = data;
        this.aplicarFiltro();
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  onFilterChange(event: any) {
    this.globalFilter = event.target.value.toLowerCase();
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.globalFilter) {
      this.filteredUsuarios = this.listaUsuarios.filter(usuario =>
        (usuario.usuarioID?.toString().toLowerCase().includes(this.globalFilter) ?? false) ||
        (usuario.nombreUsuario?.toLowerCase().includes(this.globalFilter) ?? false) ||
        (usuario.tipoUsuario?.toLowerCase().includes(this.globalFilter) ?? false)
      );
    } else {
      this.filteredUsuarios = this.listaUsuarios;
    }
  }

  nuevoUsuario() {
    this.router.navigate(['/usuario', 0]);
  }

  editarUsuario(objeto: Usuario) {
    this.router.navigate(['/usuario', objeto.usuarioID]);
  }

  eliminarUsuario(objeto: Usuario) {
    if (confirm(`¿Desea eliminar el usuario ${objeto.nombreUsuario}?`)) {
      this.usuarioServicio.borrarUsuario(objeto.usuarioID).subscribe({
        next: () => {
          this.listaUsuarios = this.listaUsuarios.filter(v => v.usuarioID !== objeto.usuarioID);
          alert('Usuario eliminado correctamente.');
        },
        error: (err) => {
          console.log(err.message);
          alert('No se pudo eliminar el usuario.');
        }
      });
    }
  }
}
