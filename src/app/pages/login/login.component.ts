import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerSessionService } from '../../services/player-session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  readonly username = signal('');
  readonly errorMessage = signal('')

  constructor(private router: Router) {}

  login(): void {
    const username = this.username().trim()

    if (!username) {
      this.errorMessage.set('Enter a username');
      return;
    }

    PlayerSessionService.createUser(username);

    // this.router.navigate(['/lobby']);
  }
}