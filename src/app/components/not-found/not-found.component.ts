import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../shared/logo/logo.component';

@Component({
  selector: 'app-not-found',
  imports: [
    RouterLink,
    LogoComponent
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
