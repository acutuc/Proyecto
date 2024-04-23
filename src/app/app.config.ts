import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { customInterceptor } from './services/custom.interceptor';

export const appConfig: ApplicationConfig = {
  //Permitimos que la URL pueda recibir parámetros con withComponentInputBinding:
  providers: [provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideHttpClient(withInterceptors([customInterceptor])),
    importProvidersFrom(HttpClientModule)
  ]
};
