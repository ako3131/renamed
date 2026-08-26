import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { PlayerSessionService } from '../../services/player-session.service';
import { RoomService } from '../../services/room.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class RoomComponent implements OnDestroy {
  private readonly user: User | null;
  private readonly roomname: string;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    this.user = PlayerSessionService.loadUser();
    this.roomname = this.route.snapshot.paramMap.get('roomname') ?? '';

    if (!this.user || !this.roomname) {
      void this.router.navigate(['/lobby']);
      return;
    }

    RoomService.createOrJoinRoom(this.roomname, this.user);
  }

  ngOnDestroy(): void {
    if (this.user && this.roomname) {
      RoomService.leaveRoom(this.roomname, this.user.playerId);
    }
  }
}
