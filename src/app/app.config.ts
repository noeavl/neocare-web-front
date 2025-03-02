import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'

import { routes } from './app.routes';
import { tokenInterceptor } from './interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
    withInterceptors([
      tokenInterceptor
    ])),
    importProvidersFrom([SweetAlert2Module.forRoot()])
  ]
};
