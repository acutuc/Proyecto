import { Sucursal } from './Sucursal';
import { Vehiculo } from './Vehiculo';

export interface Solicitud {
  solicitudID?: number;
  estado: string;
  tipoSolicitud: string;
  sucursalID: number;
  vehiculoID: number;
  clienteID: number;
  sucursal?: Sucursal;  
  vehiculo?: Vehiculo;  
}
