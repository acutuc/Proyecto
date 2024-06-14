import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { VehiculoService } from '../../services/vehiculo.service';
import { ClienteService } from '../../services/cliente.service';
import { SolicitudService } from '../../services/solicitud.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-vehiculos-en-sucursal',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ReactiveFormsModule, FloatLabelModule, InputTextModule],
  templateUrl: './vehiculos-en-sucursal.component.html',
  styleUrls: ['./vehiculos-en-sucursal.component.css']
})
export class VehiculosEnSucursalComponent implements OnInit {
  vehiculos: any[] = [];
  sucursalID: number | undefined;
  mostrarFormularioVenta: boolean = false;
  ventaForm: FormGroup;
  altaClienteForm: FormGroup;
  clienteExiste: boolean | undefined;
  clienteID: number | undefined;
  vehiculoID: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private vehiculoService: VehiculoService,
    private clienteService: ClienteService,
    private solicitudService: SolicitudService,
    private router: Router,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService
  ) {
    this.ventaForm = this.fb.group({
      dni: ['', Validators.required]
    });

    this.altaClienteForm = this.fb.group({
      nombreCliente: ['', Validators.required],
      apellidosCliente: ['', Validators.required],
      telefonoCliente: ['', Validators.required],
      dni: [{ value: '', disabled: true }, Validators.required]
    });

    this.ventaForm.get('dni')?.valueChanges.subscribe(dni => {
      this.altaClienteForm.get('dni')?.setValue(dni);
    });
  }

  ngOnInit(): void {
    const token = this.localStorageService.getItem('estaEsLaKey');

    if (!token) {
      this.router.navigateByUrl('/login');
    }


    this.route.params.subscribe(params => {
      this.sucursalID = +params['id'];

      this.vehiculoService.obtenerVehiculosEnSucursal(this.sucursalID).subscribe(
        (data: any) => {
          this.vehiculos = data;
        },
        error => {
          console.error('Error obteniendo los vehículos:', error);
        }
      );
    });
  }

  solicitarCompraVehiculo() {
    if (this.sucursalID) {
      this.router.navigate(['/solicitud-compra-vehiculo', this.sucursalID]);
    }
  }

  venderVehiculo(vehiculo: any) {
    this.vehiculoID = vehiculo.vehiculoID;
    this.mostrarFormularioVenta = true;
  }

  verificarCliente() {
    const dni = this.ventaForm.get('dni')?.value;
    this.clienteService.obtenerClientePorDni(dni).subscribe(
      (cliente) => {
        if (cliente) {
          this.clienteExiste = true;
          this.clienteID = cliente.clienteID;
          this.actualizarEstadoVenta();
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

  procesarVenta() {
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
        this.actualizarEstadoVenta();
        console.log('Cliente registrado:', cliente);
      },
      (error) => {
        console.error('Error registrando al cliente:', error);
      }
    );
  }

  actualizarEstadoVenta() {
    if (this.sucursalID === undefined || this.clienteID === undefined || this.vehiculoID === undefined) {
      console.error('SucursalID, ClienteID o VehiculoID no están definidos.');
      return;
    }

    this.solicitudService.actualizarEstadoYClienteSolicitud(this.vehiculoID, 'vendido', this.clienteID).subscribe(
      (res) => {
        console.log('Venta realizada');
        this.mostrarFormularioVenta = false;
        this.ngOnInit();
      },
      (error) => {
        console.error('Error actualizando el estado de la venta:', error);
      }
    );
  }
}
