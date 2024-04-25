import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SucursalService } from '../../services/sucursal.service';

@Component({
  selector: 'app-sucursal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.css'
})
export class SucursalComponent implements OnInit {
  public usuarios: any[] = [];

  sucursalID: number = 0;

  public formSucursal: FormGroup;

  //Constructor
  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private sucursalService: SucursalService
  ) {
    this.formSucursal = this.formBuilder.group({
      usuarioID: [null],
      nombreSucursal: [""],
      ubicacion: [""]
    });
  }

  ngOnInit(): void {
    //Obtenemos la lista de usuarios:
    this.obtenerUsuarios();
  
    const idParam = this.route.snapshot.paramMap.get('id');
    this.sucursalID = idParam ? +idParam : 0;
  
    //Si es diferente a 0, es que estamos modificando:
    if (this.sucursalID !== 0) {
      this.sucursalService.obtenerSucursal(this.sucursalID).subscribe({
        next: (data) => {
          //console.log('Datos obtenidos de la sucursal:', data);
          const sucursalFormValue = {
            sucursalID: data.sucursalID,
            usuarioID: data.usuarioID,
            nombreSucursal: data.nombreSucursal,
            ubicacion: data.ubicacion
          };
          console.log('Datos de la sucursal:', sucursalFormValue);
          this.formSucursal.patchValue(sucursalFormValue);
        },
        error: (err) => {
          console.log(err.message);
        }
      });
    }
  }

  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (data) => {
        //console.log('Datos de usuarios obtenidos:', data); 
        this.usuarios = data.map(usuario => {
          return {
            id: usuario.usuarioID,
            nombre: usuario.nombreUsuario
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

    const sucursalData = {
      sucursalID: this.sucursalID,
      usuarioID: this.formSucursal.value.usuarioID,
      nombreSucursal: this.formSucursal.value.nombreSucursal,
      ubicacion: this.formSucursal.value.ubicacion
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    //Marcamos que se está procesando una solicitud
    this.isSubmitting = true;

    // Si sucursalID es 0, estamos creando una nueva sucursal
    if (this.sucursalID === 0) {
      console.log('Datos a enviar:', sucursalData);
      this.http.post('https://localhost:7259/api/Sucursal', sucursalData, httpOptions)
        .subscribe(
          response => {
            alert('Sucursal creada correctamente.');
            this.router.navigate(['/sucursales']);
            ///Reiniciamos el estado de la solicitud:
            this.isSubmitting = false;
          },
          error => {
            console.log(error);
            if (error.error && error.error.message) {
              alert('Error: ' + error.error.message);
            } else {
              alert('Error desconocido al crear la sucursal.');
            }
            //Reiniciamos el estado de la solicitud:
            this.isSubmitting = false;
          }
        );
    } else {
      // Si sucursalID no es 0, estamos actualizando una sucursal existente
      console.log('Datos a enviar:', this.formSucursal.value);
      this.http.put(`https://localhost:7259/api/Sucursal/${this.sucursalID}`, sucursalData, httpOptions)
      .subscribe(
        response => {
          alert('Sucursal actualizada correctamente.');
          this.router.navigate(['/sucursales']);
          //Reiniciamos el estado de la solicitud:
          this.isSubmitting = false;
        },
        error => {
          console.error('Error al actualizar la sucursal:', error);
          if (error.error && error.error.message) {
            alert('Error: ' + error.error.message);
          } else {
            alert('Error desconocido al actualizar la sucursal.');
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
    this.router.navigate(["/sucursales"]);
  }
}