import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../../models/game.model';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-gameplay',
  standalone: true,
  templateUrl: './gameplay.component.html',
  styleUrl: './gameplay.component.css',
})
export class GameplayComponent {
  game: Game | null = null;
  roomname = '';

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    this.roomname = this.route.parent?.snapshot.paramMap.get('roomname') ?? '';
    this.game = RoomService.loadRoom(this.roomname);
  }

  returnToWaitingRoom(): void {
    const game = RoomService.updatePhase(this.roomname, 'waiting');

    if (game) {
      void this.router.navigate(['/room', this.roomname, 'waiting']);
    }
  }
}
