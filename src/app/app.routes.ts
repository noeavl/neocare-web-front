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
import { HospitalsComponent } from './components/dashboard/hospitals/hospitals.component';
import { HospitalsEditComponent } from './components/dashboard/hospitals/hospitals-edit/hospitals-edit.component';
import { HospitalsListComponent } from './components/dashboard/hospitals/hospitals-list/hospitals-list.component';
import { HospitalsDetailComponent } from './components/dashboard/hospitals/hospitals-detail/hospitals-detail.component';
import { HospitalsCreateComponent } from './components/dashboard/hospitals/hospitals-create/hospitals-create.component';
import { IncubatorsComponent } from './components/dashboard/incubators/incubators.component';
import { IncubatorsListComponent } from './components/dashboard/incubators/incubators-list/incubators-list.component';
import { IncubatorsCreateComponent } from './components/dashboard/incubators/incubators-create/incubators-create.component';
import { IncubatorsEditComponent } from './components/dashboard/incubators/incubators-edit/incubators-edit.component';
import { IncubatorComponent } from './components/dashboard/incubators/incubator/incubator.component';


export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'log-in', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent },
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
          { path: 'registration', component: AddressRegistrationComponent },
          { path: 'update/:id', component: AddressEditionComponent },
          { path: 'address/:id', component: AddressComponent }
        ]
      },
      {
        path: 'hospitals',
        component: HospitalsComponent,
        children: [
          { path: '', component: HospitalsListComponent },
          { path: 'create', component: HospitalsCreateComponent },
          { path: ':id', component: HospitalsDetailComponent },
          { path: ':id/edit', component: HospitalsEditComponent }

        ]
      },
      {
        path: 'incubators',
        component: IncubatorsComponent,
        children: [
          { path: 'list', component: IncubatorsListComponent },
          { path: 'create', component: IncubatorsCreateComponent },
          { path: ':id/edit', component: IncubatorsEditComponent },
          { path: ':id', component: IncubatorComponent }
        ]
      }
    ]
  },
  { path: '**', component: NotFoundComponent }
];
