import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuardGuard } from './guards/auth-guard.guard';
import { AddressRegistrationComponent } from './components/dashboard/addresses/address-registration/address-registration.component';
import { AddressesComponent } from './components/dashboard/addresses/addresses.component';
import { AddressListComponent } from './components/dashboard/addresses/address-list/address-list.component';
import { AddressEditionComponent } from './components/dashboard/addresses/address-edition/address-edition.component';
import { AddressComponent } from './components/dashboard/addresses/address/address.component';


export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'log-in', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent},
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuardGuard],
    children: [
      { 
        path: 'addresses', 
        component: AddressesComponent,
        children: [
          { path: 'list', component: AddressListComponent },
          { path: 'registration', component: AddressRegistrationComponent},
          { path: 'update/:id', component: AddressEditionComponent },
          { path: 'address/:id', component: AddressComponent}
        ]
      }
    ]
  },
  { path: '**', component: NotFoundComponent}
];
