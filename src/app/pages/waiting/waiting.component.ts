import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerSessionService } from '../../services/player-session.service';
import { Game } from '../../models/game.model';
import { User } from '../../models/user.model';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-waiting',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './waiting.component.html',
  styleUrl: './waiting.component.css'
})
export class WaitingComponent implements OnDestroy {
  private hasLeftRoom = false;

  user: User | null = null;
  game: Game | null = null;
  username = '';
  roomname = '';
  playerid = '';

  ngOnDestroy(): void {
    this.leaveCurrentRoom();
  }

  constructor(private router: Router, private route: ActivatedRoute) {
    this.user = PlayerSessionService.loadUser();
    this.username = this.user?.username ?? '';
    this.playerid = this.user?.playerId ?? '';

    this.roomname = this.route.snapshot.paramMap.get('roomname') ?? '';

    if (this.user && this.roomname) {
        this.game = RoomService.createOrJoinRoom(this.roomname, this.user);
    }
  }

  returnToLobby(): void {
    this.router.navigate(['/lobby']);
  }

  private leaveCurrentRoom(): void {
    if (this.hasLeftRoom || !this.user || !this.roomname) return;

    RoomService.leaveRoom(this.roomname, this.user.playerId);
    this.hasLeftRoom = true;
  }

}