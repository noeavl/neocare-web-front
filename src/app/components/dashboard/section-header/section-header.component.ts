import { Component, input, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-header',
  imports: [
    RouterLink
  ],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.css'
})
export class SectionHeaderComponent {
  @Input({ required: true }) title!: string
  @Input({ required: true }) route!: string
  @Input({ required: true }) imgRoute!: string
}
