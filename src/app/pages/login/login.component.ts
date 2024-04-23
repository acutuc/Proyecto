import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, FloatLabelModule, HttpClientModule, PasswordModule, InputTextModule, ButtonModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  //Variable para alternar el formulario de registro:
  registroVisible: boolean = false;

  //
  registroObj: Registro = new Registro();

  loginObj: Login;

  //Variable para almacenar el tipo de usuario
  tipoUsuario = "";

  constructor(private http: HttpClient, private router: Router) {
    this.loginObj = new Login();
    this.registroObj = new Registro();
  }

  onRegistro() {
    this.http.post('https://localhost:7259/api/Usuario', this.registroObj).subscribe((res: any) => {
        if (res && res.usuarioID) {
          alert("Usuario registrado");
          this.registroVisible = false;
        } else {
          alert("Error desconocido.");
        }
      },
      (error: any) => {
        //Unauthorized desde el back, mostramos el error que nos devuelve el objeto:
        if (error.status === 401) {
          alert(error.error.message);
        } else {
          console.log(error.message);
          alert('Error inesperado');
        }
      }
    );
  }


  onLogin() {
    this.http.post('https://localhost:7259/api/Usuario/login', this.loginObj).subscribe((res: any) => {
        if (res && res.token) {
          //Nos guardamos el tipo de usuario:
          this.tipoUsuario = res.tipoUsuario;
          alert("Logueado con éxito");
          //Guardamos el token:
          localStorage.setItem('estaEsLaKey', res.token);
          //Guardamos los datos del usuario:
          localStorage.setItem('usuarioLogueado', JSON.stringify(res.nombreUsuario));

          if (this.tipoUsuario === "admin") {
            this.router.navigateByUrl('/dashboard');
          } else {
            /////////////////////////////////////////////////
            console.log("redirige a otro lado");
          }
        } else {
          this.handleError("Error inesperado al intentar iniciar sesasdasdión.");
        }
      },
      (error: any) => {
        if (error.status === 401) {
          this.handleError(error.error.message);
        } else {
          this.handleError("Error inesperado al intentar iniciar dfdsafsdf.");
        }
      }
    );
  }

  private handleError(mensajeError: string) {
    console.log(mensajeError);
    alert(mensajeError);
  }

  //Comprobamos si existe la sesión iniciada:
  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('estaEsLaKey');

      //Si hay token, nos redirige a donde nos pertenezca si somos admin u otro tipo de usuario:
      if (token) {
        if (this.tipoUsuario === "admin") {
          this.router.navigateByUrl('/dashboard');
        } else {
          /////////////////////////////////////////////////
          console.log("redirige a otro lado");
        }
      }
    }
  }
}

//Clase para registrarnos:
export class Registro {
  nombreUsuario: string;
  claveUsuario: string;

  constructor() {
    this.nombreUsuario = "";
    this.claveUsuario = "";
  }
}

//Clase para loguearnos:
export class Login {
  nombreUsuario: string;
  claveUsuario: string;

  constructor() {
    this.nombreUsuario = '';
    this.claveUsuario = '';
  }
}