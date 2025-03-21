import { Component , Input} from '@angular/core';
import { CardComponent } from '../../../../shared/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-room-incubator-card',
  imports: [CardComponent, CommonModule, MatIconModule],
  templateUrl: './room-incubator-card.component.html',
  styleUrl: './room-incubator-card.component.css'
})
export class RoomIncubatorCardComponent {
  @Input() id!: number
  @Input() state!: string
  @Input() nurse_full_name!: string
  @Input() baby_full_name!: string
  getStateIcon(state: string): string {
    switch (state) {
      case 'available': return 'check_circle'
      case 'active': return 'block'
      default: return 'help_outline'
    }
  }
}
