import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayerSessionService } from './services/player-session.service';
import { UserState } from './models/user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('renamed');
  protected readonly userState = signal<UserState>(
    PlayerSessionService.loadUserState() ?? PlayerSessionService.createUserState()
  );

  protected logout(): void {
    PlayerSessionService.clearUserState();
    const nextUser = PlayerSessionService.createUserState();
    this.userState.set(nextUser);
  }
}
