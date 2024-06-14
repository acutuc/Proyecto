import { Component, OnInit } from '@angular/core';
import { VehiculoService } from '../../services/vehiculo.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../../services/local-storage.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-vehiculo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputTextModule, FloatLabelModule, ButtonModule],
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.css'
})
export class VehiculoComponent implements OnInit {
  vehiculoID: number = 0;

  public formVehiculo: FormGroup;

  //Constructor
  constructor(
    private router: Router,
    private vehiculoService: VehiculoService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.formVehiculo = this.formBuilder.group({
      marca: [""],
      modelo: [""],
      anio: [0],
      precio: [0]
    });
  }



  ngOnInit(): void {
    const token = this.localStorageService.getItem('estaEsLaKey');

    //Si no tenemos token, no podemos acceder a la página y nos redirigirá al login
    if (!token) {
      this.router.navigateByUrl('/login')
    }



    const idParam = this.route.snapshot.paramMap.get('id');
    this.vehiculoID = idParam ? +idParam : 0;

    //Si es diferente a 0, es que estamos modificando:
    if (this.vehiculoID !== 0) {
      this.vehiculoService.obtenerVehiculo(this.vehiculoID).subscribe({
        next: (data) => {
          const vehiculoFormValue = {
            vehiculoID: data.vehiculoID,
            marca: data.marca,
            modelo: data.modelo,
            anio: data.anio,
            precio: data.precio
          };
          console.log('Datos del vehículo:', vehiculoFormValue);
          this.formVehiculo.patchValue(vehiculoFormValue);
        },
        error: (err) => {
          console.log(err.message);
        }
      });
    }
  }


  isSubmitting = false;
  guardar() {
    //Verificamos si ya se está procesando una solicitud:
    if (this.isSubmitting) {
      return;
    }

    const vehiculoData = {
      vehiculoID: this.vehiculoID,
      marca: this.formVehiculo.value.marca,
      modelo: this.formVehiculo.value.modelo,
      anio: this.formVehiculo.value.anio,
      precio: this.formVehiculo.value.precio
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    //Marcamos que se está procesando una solicitud
    this.isSubmitting = true;

    //Si vehiculoID es 0, estamos creando un nuevo vehículo
    if (this.vehiculoID === 0) {
      this.http.post('https://localhost:7259/api/Vehiculo', this.formVehiculo.value, httpOptions)
        .subscribe(
          response => {
            alert('Vehículo creado correctamente.');
            this.router.navigate(['/vehiculos']);
            ///Reiniciamos el estado de la solicitud:
            this.isSubmitting = false;
          },
          error => {
            console.log(error);
            if (error.error && error.error.message) {
              alert('Error: ' + error.error.message);
            } else {
              alert('Error desconocido al crear el vehículo.');
            }
            //Reiniciamos el estado de la solicitud:
            this.isSubmitting = false;
          }
        );
    } else {
      // Si vehiculoID no es 0, estamos actualizando un vehículo existente
      console.log('Datos a enviar:', this.formVehiculo.value);
      this.http.put(`https://localhost:7259/api/Vehiculo/${this.vehiculoID}`, vehiculoData, httpOptions)
        .subscribe(
          response => {
            alert('Vehículo actualizado correctamente.');
            this.router.navigate(['/vehiculos']);
            //Reiniciamos el estado de la solicitud:
            this.isSubmitting = false;
          },
          error => {
            console.error('Error al actualizar el vehículo:', error);
            if (error.error && error.error.message) {
              alert('Error: ' + error.error.message);
            } else {
              alert('Error desconocido al actualizar el vehículo.');
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
    this.router.navigate(["/vehiculos"]);
  }
}