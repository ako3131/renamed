import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../../models/game.model';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-waiting',
  standalone: true,
  imports: [],
  templateUrl: './waiting.component.html',
  styleUrl: './waiting.component.css'
})
export class WaitingComponent {
  game: Game | null = null;
  roomname = '';

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {
    this.roomname = this.route.parent?.snapshot.paramMap.get('roomname') ?? '';
    this.game = RoomService.loadRoom(this.roomname);
  }

  returnToLobby(): void {
    void this.router.navigate(['/lobby']);
  }

  startGame(): void {
    const game = RoomService.updatePhase(this.roomname, 'renaming');

    if (game) {
      void this.router.navigate(['/room', this.roomname, 'play']);
    }
  }
}
