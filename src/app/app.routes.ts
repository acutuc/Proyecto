import { Routes } from '@angular/router';
import { VehiculoComponent } from './pages/vehiculo/vehiculo.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VehiculosComponent } from './pages/vehiculos/vehiculos.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { SucursalesComponent } from './pages/sucursales/sucursales.component';
import { SucursalComponent } from './pages/sucursal/sucursal.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { NdashboardComponent } from './pages/ndashboard/ndashboard.component';
import { VehiculosEnSucursalComponent } from './pages/vehiculos-en-sucursal/vehiculos-en-sucursal.component';
import { SolicitudCompraVehiculoComponent } from './pages/solicitud-compra-vehiculo/solicitud-compra-vehiculo.component';

export const routes: Routes = [
    {
        path: "", redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    //LayoutComponent nos servirá para redirigir en caso de haber iniciado sesión:
    {
        path: "",
        component: LayoutComponent,
        children:[
            {
                path:'dashboard',
                component:DashboardComponent
            },
            {
                path:'vehiculos',
                component:VehiculosComponent
            },
            {
                path: "vehiculo/:id",
                component: VehiculoComponent
            },
            {
                path:'usuarios',
                component:UsuariosComponent
            },
            {
                path:'usuario/:id',
                component:UsuarioComponent
            },
            {
                path:'sucursales',
                component:SucursalesComponent
            },
            {
                path:'sucursal',
                component:SucursalComponent
            },
            {
                path: "sucursal/:id",
                component: SucursalComponent
            },
            {
                path:'ndashboard',
                component:NdashboardComponent
            },
            {
                path:'vehiculos-en-sucursal/:id',
                component:VehiculosEnSucursalComponent
            },
            {
                path:'solicitud-compra-vehiculo',
                component:SolicitudCompraVehiculoComponent
            }
        ]
    }
];
