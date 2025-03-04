import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import { providePrimeNG } from 'primeng/config' 
import Aura from '@primeng/themes/aura'
import Nora from '@primeng/themes/nora'
import Material from '@primeng/themes/material'
import Lara from '@primeng/themes/lara'
import { provideAnimations } from '@angular/platform-browser/animations'

import { routes } from './app.routes';
import { tokenInterceptor } from './interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
    withInterceptors([tokenInterceptor])),
    importProvidersFrom([SweetAlert2Module.forRoot()]),
    providePrimeNG({theme: { preset: Nora } }),
    provideAnimations()
  ]
};