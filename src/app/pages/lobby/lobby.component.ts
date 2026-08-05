import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerSessionService } from '../../services/player-session.service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent {
  readonly errorMessage = signal('');

  constructor(private router: Router) {}

  lobby(): void {

    this.router.navigate(['/waiting']);
  }
}