import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/Usuario'
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{
  public listaUsuarios: Usuario[] = [];
  public mostrarColumnas: any[];
  
  constructor(private usuarioServicio: UsuarioService, private router: Router){
    this.mostrarColumnas = [
      { field: 'usuarioID', header: 'ID Usuario' },
      { field: 'nombreUsuario', header: 'Usuario' },
      { field: 'tipoUsuario', header:"Rol"},
      { field: 'accion', header: "" }
    ];
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('estaEsLaKey');

      //Si no tenemos token, no podemos acceder a la página y nos redirigirá al login
      if (!token) {
        this.router.navigateByUrl('/login')
      }
      this.obtenerUsuarios();
    }
  }

  obtenerUsuarios() {
    this.usuarioServicio.obtenerUsuarios().subscribe({
      next: (data) => {
        this.listaUsuarios = data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
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
