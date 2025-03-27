import { Routes } from '@angular/router'
import { LandingComponent } from './components/landing/landing.component'
import { LoginComponent } from './components/login/login.component'
import { SignupComponent } from './components/signup/signup.component'
import { NotFoundComponent } from './components/not-found/not-found.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { authGuardGuard } from './guards/auth-guard.guard'
import { AddressRegistrationComponent } from './components/dashboard/addresses/address-registration/address-registration.component'
import { AddressesComponent } from './components/dashboard/addresses/addresses.component'
import { AddressListComponent } from './components/dashboard/addresses/address-list/address-list.component'
import { AddressEditionComponent } from './components/dashboard/addresses/address-edition/address-edition.component'
import { AddressComponent } from './components/dashboard/addresses/address/address.component'
import { HospitalsComponent } from './components/dashboard/hospitals/hospitals.component'
import { HospitalsEditComponent } from './components/dashboard/hospitals/hospitals-edit/hospitals-edit.component'
import { HospitalsListComponent } from './components/dashboard/hospitals/hospitals-list/hospitals-list.component'
import { HospitalsDetailComponent } from './components/dashboard/hospitals/hospitals-detail/hospitals-detail.component'
import { HospitalsCreateComponent } from './components/dashboard/hospitals/hospitals-create/hospitals-create.component'
import { IncubatorsComponent } from './components/dashboard/incubators/incubators.component'
import { IncubatorsListComponent } from './components/dashboard/incubators/incubators-list/incubators-list.component'
import { IncubatorsCreateComponent } from './components/dashboard/incubators/incubators-create/incubators-create.component'
import { IncubatorsEditComponent } from './components/dashboard/incubators/incubators-edit/incubators-edit.component'
import { IncubatorComponent } from './components/dashboard/incubators/incubator/incubator.component'
import { BabiesComponent } from './components/dashboard/babies/babies/babies.component'
import { BabiesListComponent } from './components/dashboard/babies/babies-list/babies-list.component'
import { BabiesCreateComponent } from './components/dashboard/babies/babies-create/babies-create.component'
import { BabiesEditComponent } from './components/dashboard/babies/babies-edit/babies-edit.component'
import { BabiesDetailComponent } from './components/dashboard/babies/babies-detail/babies-detail.component'
import { RoomsComponent } from './components/dashboard/rooms/rooms.component'
import { RoomsListComponent } from './components/dashboard/rooms/rooms-list/rooms-list.component'
import { RoomsCreateComponent } from './components/dashboard/rooms/rooms-create/rooms-create.component'
import { RoomsEditComponent } from './components/dashboard/rooms/rooms-edit/rooms-edit.component'
import { RoomsDetailComponent } from './components/dashboard/rooms/rooms-detail/rooms-detail.component'
import { TemperatureComponent } from './components/dashboard/incubators/incubator/sensors/temperature/temperature.component'
import { HumidityComponent } from './components/dashboard/incubators/incubator/sensors/humidity/humidity.component'
import { MovementComponent } from './components/dashboard/incubators/incubator/sensors/movement/movement.component'
import { SoundComponent } from './components/dashboard/incubators/incubator/sensors/sound/sound.component'
import { LightComponent } from './components/dashboard/incubators/incubator/sensors/light/light.component'
import { VibrationComponent } from './components/dashboard/incubators/incubator/sensors/vibration/vibration.component'
import { DetailComponent } from './components/dashboard/incubators/incubator/detail/detail.component'
import { MainDashboardComponent } from './components/dashboard/main-dashboard/main-dashboard.component'

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
        path: '',
        component: MainDashboardComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'addresses',
        component: AddressesComponent,
        canActivate: [authGuardGuard],
        children: [
          { path: 'list', component: AddressListComponent, canActivate: [authGuardGuard], },
          { path: 'registration', component: AddressRegistrationComponent, canActivate: [authGuardGuard], },
          { path: 'update/:id', component: AddressEditionComponent, canActivate: [authGuardGuard], },
          { path: 'address/:id', component: AddressComponent, canActivate: [authGuardGuard], }
        ]
      },
      {
        path: 'hospitals',
        component: HospitalsComponent,
        canActivate: [authGuardGuard],
        children: [
          { path: '', component: HospitalsListComponent, canActivate: [authGuardGuard], },
          { path: 'create', component: HospitalsCreateComponent, canActivate: [authGuardGuard], },
          { path: ':id', component: HospitalsDetailComponent, canActivate: [authGuardGuard], },
          { path: ':id/edit', component: HospitalsEditComponent, canActivate: [authGuardGuard], }

        ]
      },
      {
        path: 'incubators',
        component: IncubatorsComponent,
        canActivate: [authGuardGuard],
        children: [
          { path: 'list', component: IncubatorsListComponent, canActivate: [authGuardGuard], },
          { path: 'create', component: IncubatorsCreateComponent, canActivate: [authGuardGuard], },
          { path: ':id/edit', component: IncubatorsEditComponent, canActivate: [authGuardGuard], },
          { 
            path: ':id', 
            component: IncubatorComponent, 
            canActivate: [authGuardGuard],
            children: [
              { path: '', component: DetailComponent, canActivate: [authGuardGuard], },
              { path: 'temperature', component: TemperatureComponent, canActivate: [authGuardGuard], },
              { path: 'humidity', component: HumidityComponent, canActivate: [authGuardGuard], },
              { path: 'movement', component: MovementComponent, canActivate: [authGuardGuard], },
              { path: 'sound', component: SoundComponent, canActivate: [authGuardGuard], },
              { path: 'light', component: LightComponent, canActivate: [authGuardGuard], },
              { path: 'vibration', component: VibrationComponent, canActivate: [authGuardGuard], }
            ]
          }
        ]
      },
      {
        path: 'babies',
        component: BabiesComponent,
        canActivate: [authGuardGuard],
        children: [
          { path: 'list', component: BabiesListComponent, canActivate: [authGuardGuard], },
          { path: 'create', component: BabiesCreateComponent, canActivate: [authGuardGuard], },
          { path: ':id/edit', component: BabiesEditComponent, canActivate: [authGuardGuard], },
          { path: ':id', component: BabiesDetailComponent, canActivate: [authGuardGuard], }]
      }, {
        path: 'rooms',
        component: RoomsComponent,
        canActivate: [authGuardGuard],
        children: [
          { path: 'list', component: RoomsListComponent, canActivate: [authGuardGuard], },
          { path: 'create', component: RoomsCreateComponent, canActivate: [authGuardGuard], },
          { path: ':id/edit', component: RoomsEditComponent, canActivate: [authGuardGuard], },
          {
            path: ':id',
            component: RoomsDetailComponent,
            canActivate: [authGuardGuard],
          }
        ]
      }
    ]
  },
  { path: '**', component: NotFoundComponent }
]
