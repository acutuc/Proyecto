import { Component, OnInit } from '@angular/core';
import { VehiculoService } from '../../services/vehiculo.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Vehiculo } from '../../models/Vehiculo';
import { ReactiveFormsModule } from '@angular/forms';
import { SucursalService } from '../../services/sucursal.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-vehiculo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.css'
})
export class VehiculoComponent implements OnInit {
  public sucursales: any[] = [];

  vehiculoID: number = 0;

  public formVehiculo: FormGroup;

  //Constructor
  constructor(
    private router: Router,
    private vehiculoService: VehiculoService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sucursalService: SucursalService,
    private http: HttpClient
  ) {
    this.formVehiculo = this.formBuilder.group({
      sucursalID: [0],
      marca: [""],
      modelo: [""],
      anio: [0],
      precio: [0],
      vendido: [false]
    });
  }



  ngOnInit(): void {
    //Obtenemos la lista de sucursales:
    this.obtenerSucursales();
  
    const idParam = this.route.snapshot.paramMap.get('id');
    this.vehiculoID = idParam ? +idParam : 0;
  
    //Si es diferente a 0, es que estamos modificando:
    if (this.vehiculoID !== 0) {
      this.vehiculoService.obtenerVehiculo(this.vehiculoID).subscribe({
        next: (data) => {
          const vehiculoFormValue = {
            vehiculoID: data.vehiculoID,
            sucursalID: data.sucursalID,
            marca: data.marca,
            modelo: data.modelo,
            anio: data.anio,
            precio: data.precio,
            vendido: data.vendido
          };
          console.log('Datos del vehículo:', vehiculoFormValue); // Imprime los datos recibidos
          this.formVehiculo.patchValue(vehiculoFormValue);
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

    const vehiculoData = {
      vehiculoID: this.vehiculoID,
      sucursalID: this.formVehiculo.value.sucursalID,
      marca: this.formVehiculo.value.marca,
      modelo: this.formVehiculo.value.modelo,
      anio: this.formVehiculo.value.anio,
      precio: this.formVehiculo.value.precio,
      vendido: this.formVehiculo.value.vendido
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    //Marcamos que se está procesando una solicitud
    this.isSubmitting = true;

    // Si vehiculoID es 0, estamos creando un nuevo vehículo
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