import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { VehiculoComponent } from './pages/vehiculo/vehiculo.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VehiculosComponent } from './pages/vehiculos/vehiculos.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { SucursalesComponent } from './pages/sucursales/sucursales.component';

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
                path:'usuarios',
                component:UsuariosComponent
            },
            {
                path:'sucursales',
                component:SucursalesComponent
            }
        ]
    },
    {
        path: "inicio",
        component: InicioComponent
    },
    {
        path: "vehiculo/:id",
        component: VehiculoComponent
    }
];
