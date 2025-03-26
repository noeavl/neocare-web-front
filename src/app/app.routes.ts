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
        component: MainDashboardComponent
      },
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
          { path: '', component: HospitalsListComponent, canActivate: [authGuardGuard], },
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
          { 
            path: ':id', 
            component: IncubatorComponent, 
            children: [
              {path: '', component: DetailComponent},
              { path: 'temperature', component: TemperatureComponent },
              { path: 'humidity', component: HumidityComponent },
              { path: 'movement', component: MovementComponent },
              { path: 'sound', component: SoundComponent },
              { path: 'light', component: LightComponent },
              { path: 'vibration', component: VibrationComponent }
            ]
          }
        ]
      },
      {
        path: 'babies',
        component: BabiesComponent,
        children: [
          { path: 'list', component: BabiesListComponent },
          { path: 'create', component: BabiesCreateComponent },
          { path: ':id/edit', component: BabiesEditComponent },
          { path: ':id', component: BabiesDetailComponent }]
      }, {
        path: 'rooms',
        component: RoomsComponent,
        children: [
          { path: 'list', component: RoomsListComponent },
          { path: 'create', component: RoomsCreateComponent },
          { path: ':id/edit', component: RoomsEditComponent },
          {
            path: ':id',
            component: RoomsDetailComponent,
          }
        ]
      }
    ]
  },
  { path: '**', component: NotFoundComponent }
]
