import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerSessionService } from '../../services/player-session.service';
import { RoomService } from '../../services/room.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent {

  readonly roomname = signal('');
  username = '';
  user: User | null = null;
  totalPlayersStr = '';
  totalGamesStr = '';

  constructor(private router: Router) {
    this.user = PlayerSessionService.loadUser();
    this.username = this.user?.username ?? '';

    const players = RoomService.totalPlayers();
    const games = RoomService.totalGames();

    this.totalPlayersStr = `${players} ${players === 1 ? 'person' : 'people'}`;
    this.totalGamesStr = `${games} ${games === 1 ? 'game' : 'games'}`;
  }

  async enterGame(): Promise<void> {
    console.log('cloicked')
    const roomname = this.roomname().trim();

    if (!roomname || !this.user) {
      return;
    }

    await this.router.navigate(['/room', roomname, 'waiting']);
  }

  returnToLogin(): void {
    this.router.navigate(['/'])
  }
}
