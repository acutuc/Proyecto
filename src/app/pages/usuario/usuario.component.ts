import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service';
import { SucursalService } from '../../services/sucursal.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputTextModule, FloatLabelModule, ButtonModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})

export class UsuarioComponent implements OnInit {
  public usuarios: any[] = [];

  public sucursales: any[] = [];

  usuarioID: number = 0;

  public formUsuario: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sucursalService: SucursalService,
    private usuarioService: UsuarioService,
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.formUsuario = this.formBuilder.group({
      nombreUsuario: [""],
      claveUsuario: [""]
    });
  }

  ngOnInit(): void {
    const token = this.localStorageService.getItem('estaEsLaKey');

      //Si no tenemos token, no podemos acceder a la página y nos redirigirá al login
      if (!token) {
        this.router.navigateByUrl('/login')
      }
      
    
    
    //Obtenemos la lista de sucursales:
    this.obtenerSucursales();

    const idParam = this.route.snapshot.paramMap.get('id');
    this.usuarioID = idParam ? +idParam : 0;

    //Si es diferente a 0, es que estamos modificando:
    if (this.usuarioID !== 0) {
      this.usuarioService.obtenerUsuario(this.usuarioID).subscribe({
        next: (data) => {
          const usuarioFormValue = {
            usuarioID: data.usuarioID,
            nombreUsuario: data.nombreUsuario,
            claveUsuario: data.claveUsuario,
            tipoUsuario: data.tipoUsuario
          };
          console.log('Datos del usuario:', usuarioFormValue);
          this.formUsuario.patchValue(usuarioFormValue);
        },
        error: (err) => {
          console.log(err.message);
        }
      });
    }
  }

  obtenerSucursales() {
    this.sucursalService.obtenerSucursales().subscribe({
      next: (data) => {
        this.sucursales = data.map(sucursal => {
          return {
            id: sucursal.sucursalID,
            nombre: sucursal.nombreSucursal
          };
        });
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  isSubmitting = false;
  guardar() {
    //Verificamos si ya se está procesando una solicitud:
    if (this.isSubmitting) {
      return;
    }

    const usuarioData = {
      usuarioID: this.usuarioID,
      nombreUsuario: this.formUsuario.value.nombreUsuario,
      claveUsuario: this.formUsuario.value.claveUsuario,
      tipoUsuario: this.formUsuario.value.tipoUsuario
      
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    //Marcamos que se está procesando una solicitud
    this.isSubmitting = true;

    // Si usuarioID es 0, estamos creando un nuevo usuario
    if (this.usuarioID === 0) {
      this.http.post('https://localhost:7259/api/Usuario', this.formUsuario.value, httpOptions)
        .subscribe(
          response => {
            alert('Usuario creado correctamente.');
            this.router.navigate(['/usuarios']);
            ///Reiniciamos el estado de la solicitud:
            this.isSubmitting = false;
          },
          error => {
            console.log(error);
            if (error.error && error.error.message) {
              alert('Error: ' + error.error.message);
            } else {
              alert('Error desconocido al crear el usuario.');
            }
            //Reiniciamos el estado de la solicitud:
            this.isSubmitting = false;
          }
        );
    } else {
      // Si usuarioID no es 0, estamos actualizando un usuario existente
      console.log('Datos a enviar:', this.formUsuario.value);
      this.http.put(`https://localhost:7259/api/Usuario/${this.usuarioID}`, usuarioData, httpOptions)
        .subscribe(
          response => {
            alert('Usuario actualizado correctamente.');
            this.router.navigate(['/usuarios']);
            //Reiniciamos el estado de la solicitud:
            this.isSubmitting = false;
          },
          error => {
            console.error('Error al actualizar el usuario:', error);
            if (error.error && error.error.message) {
              alert('Error: ' + error.error.message);
            } else {
              alert('Error desconocido al actualizar el usuario.');
            }
            //Reiniciamos el estado de la solicitud:
            this.isSubmitting = false;
          }
        );
    }
  }

  //Función para manejar el envío del formulario
  onSubmit() {
    this.guardar();
  }

  volver() {
    this.router.navigate(["/usuarios"]);
  }

}