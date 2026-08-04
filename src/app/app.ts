import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerSessionService } from './services/player-session.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('renamed');
  protected readonly user = signal<User>(
    PlayerSessionService.loadUser() ?? PlayerSessionService.createUser()
  );

  protected logout(): void {
    PlayerSessionService.clearUser();
    const nextUser = PlayerSessionService.createUser();
    this.user.set(nextUser);
  }

  protected updateUsername(newUsername: string): void {
    PlayerSessionService.updateUsername(newUsername);

    const savedUser = PlayerSessionService.loadUser();
    if (savedUser) {
      this.user.set(savedUser);
    }
  }
}
