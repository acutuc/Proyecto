import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ClienteService } from '../../services/cliente.service';
import { HttpClientModule } from '@angular/common/http';
import { VehiculoService } from '../../services/vehiculo.service';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud } from '../../models/Solicitud';
import { Cliente } from '../../models/Cliente';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-solicitud-compra-vehiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, ButtonModule, HttpClientModule, InputNumberModule],
  templateUrl: './solicitud-compra-vehiculo.component.html',
  styleUrls: ['./solicitud-compra-vehiculo.component.css']
})
export class SolicitudCompraVehiculoComponent implements OnInit {
  sucursalID: number | undefined;
  solicitudForm: FormGroup;
  altaClienteForm: FormGroup;
  vehiculoForm: FormGroup;
  clienteExiste: boolean | undefined;
  clienteID: number | undefined;
  mostrarFormularioVehiculo: boolean = false;
  clienteDatos: Cliente | null = null; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private vehiculoService: VehiculoService,
    private solicitudService: SolicitudService
  ) {
    this.solicitudForm = this.fb.group({
      dni: ['', Validators.required]
    });

    this.altaClienteForm = this.fb.group({
      nombreCliente: ['', Validators.required],
      apellidosCliente: ['', Validators.required],
      telefonoCliente: ['', Validators.required],
      dni: [{ value: '', disabled: true }, Validators.required]
    });

    this.vehiculoForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', Validators.required],
      precio: ['', Validators.required]
    });

    this.solicitudForm.get('dni')?.valueChanges.subscribe(dni => {
      this.altaClienteForm.get('dni')?.setValue(dni);
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sucursalID = +params['id'];
    });
  }

  verificarCliente() {
    const dni = this.solicitudForm.get('dni')?.value;
    this.clienteService.obtenerClientePorDni(dni).subscribe(
      (cliente) => {
        if (cliente) {
          this.clienteExiste = true;
          this.clienteID = cliente.clienteID;
          this.clienteDatos = cliente;
          this.mostrarFormularioVehiculo = true;
          console.log('El cliente existe con ID:', this.clienteID);
        } else {
          this.clienteExiste = false;
          console.log('El cliente no existe');
        }
      },
      (error) => {
        if (error.status === 404) {
          this.clienteExiste = false;
          console.log('El cliente no existe');
        } else {
          console.error('Error verificando el cliente:', error);
        }
      }
    );
  }

  onSubmit() {
    this.verificarCliente();
  }

  registrarNuevoCliente() {
    if (this.altaClienteForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const nuevoCliente = this.altaClienteForm.getRawValue();
    this.clienteService.crearCliente(nuevoCliente).subscribe(
      (cliente) => {
        this.clienteID = cliente.clienteID;
        this.clienteDatos = cliente;
        this.mostrarFormularioVehiculo = true;
        console.log('Cliente registrado:', cliente);
      },
      (error) => {
        console.error('Error registrando al cliente:', error);
      }
    );
  }

  registrarVehiculo() {
    if (this.vehiculoForm.invalid) {
      console.log('Formulario de vehículo inválido');
      return;
    }

    const nuevoVehiculo = this.vehiculoForm.value;

    this.vehiculoService.crearVehiculo(nuevoVehiculo).subscribe(
      (vehiculo) => {
        console.log('Vehículo registrado:', vehiculo);
        this.crearSolicitud(vehiculo.vehiculoID);
      },
      (error) => {
        console.error('Error registrando el vehículo:', error);
      }
    );
  }

  crearSolicitud(vehiculoID: number) {
    if (this.sucursalID === undefined || this.clienteID === undefined) {
      console.error('SucursalID o ClienteID no están definidos.');
      return;
    }

    const nuevaSolicitud: Solicitud = {
      estado: 'pendiente',
      tipoSolicitud: 'compra',
      sucursalID: this.sucursalID,
      vehiculoID: vehiculoID,
      clienteID: this.clienteID
    };

    this.solicitudService.crearSolicitud(nuevaSolicitud).subscribe(
      (solicitud) => {
        console.log('Solicitud creada:', solicitud);
        this.router.navigateByUrl('/ndashboard');
      },
      (error) => {
        console.error('Error creando la solicitud:', error);
      }
    );
  }
}
