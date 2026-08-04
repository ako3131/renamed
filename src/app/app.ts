import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerSessionService } from './services/player-session.service';
import { User } from './models/user.model';
import { RoomService } from './services/room.service';
import { Game } from './models/game.model';

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
  protected readonly roomCode = signal('');
  protected readonly activeRoom = signal<Game | null>(this.loadCurrentUserRoom());
  protected readonly statusMessage = signal('');

  constructor() {
    const restoredRoom = this.loadCurrentUserRoom();

    if (restoredRoom) {
      this.activeRoom.set(restoredRoom);
      this.roomCode.set(restoredRoom.roomName);
    }
  }

  protected logout(): void {
    const roomCode = this.user().currentRoom;

    if (roomCode) {
      RoomService.leaveRoom(roomCode, this.user().playerId);
    }

    this.activeRoom.set(null);
    this.roomCode.set('');

    PlayerSessionService.clearUser();
    const nextUser = PlayerSessionService.createUser();
    this.user.set(nextUser);
    this.statusMessage.set('Created a fresh player ID.');
  }

  protected updateUsername(newUsername: string): void {
    PlayerSessionService.updateUsername(newUsername);

    const savedUser = PlayerSessionService.loadUser();
    if (savedUser) {
      this.user.set(savedUser);
    }

    this.refreshCurrentRoom();
    this.statusMessage.set('Username updated.');
  }

  protected enterRoom(roomCode: string): void {
    if (this.activeRoom()) {
      this.statusMessage.set('You are already in a room. Leave it first.');
      return;
    }

    const room = RoomService.createOrJoinRoom(roomCode, this.user());

    if (!room) {
      this.statusMessage.set('Enter a valid room code.');
      return;
    }

    this.activeRoom.set(room);
    this.roomCode.set(room.roomName);

    const updatedUser: User = {
      ...this.user(),
      currentRoom: room.roomName,
    };

    PlayerSessionService.saveUser(updatedUser);
    this.user.set(updatedUser);
    this.statusMessage.set(`Joined room ${room.roomName}.`);
  }

  protected leaveRoom(): void {
    const roomCode = this.user().currentRoom;

    if (!roomCode) {
      this.statusMessage.set('You are not in a room.');
      return;
    }

    const updatedRoom = RoomService.leaveRoom(roomCode, this.user().playerId);

    if (!updatedRoom || updatedRoom.phase === 'empty') {
      this.activeRoom.set(null);
      this.roomCode.set('');

      const updatedUser: User = {
        ...this.user(),
        currentRoom: undefined,
      };

      PlayerSessionService.saveUser(updatedUser);
      this.user.set(updatedUser);
      this.statusMessage.set(`Left room ${roomCode}.`);
      return;
    }

    this.activeRoom.set(updatedRoom);
    this.roomCode.set(updatedRoom.roomName);

    const updatedUser: User = {
      ...this.user(),
      currentRoom: updatedRoom.roomName,
    };

    PlayerSessionService.saveUser(updatedUser);
    this.user.set(updatedUser);
    this.statusMessage.set(`Left room ${roomCode}.`);
  }

  protected refreshRoom(): void {
    this.refreshCurrentRoom();
    this.statusMessage.set('Room data refreshed.');
  }

  private refreshCurrentRoom(): void {
    const roomCode = this.user().currentRoom;

    if (!roomCode) {
      return;
    }

    const refreshedRoom = RoomService.loadRoom(roomCode);

    if (!refreshedRoom) {
      this.activeRoom.set(null);
      this.roomCode.set('');

      const updatedUser: User = {
        ...this.user(),
        currentRoom: undefined,
      };

      PlayerSessionService.saveUser(updatedUser);
      this.user.set(updatedUser);
      this.statusMessage.set('Room no longer exists.');
      return;
    }

    this.activeRoom.set(refreshedRoom);
  }

  private loadCurrentUserRoom(): Game | null {
    const roomCode = this.user().currentRoom;

    if (!roomCode) {
      return null;
    }

    return RoomService.loadRoom(roomCode);
  }

  protected roomPlayerList(): string {
    const room = this.activeRoom();
    return room?.players?.length
      ? room.players.map((p) => p.username).join(', ')
      : 'No players';
  }

  protected totalPlayers(): number {
    return RoomService.totalPlayers();
  }

  protected totalGames(): number {
    return RoomService.totalGames();
  }

  protected reset(): void {
    this.logout();
    this.statusMessage.set('Reset complete. New player ID created.');
    this.activeRoom.set(null);
    this.roomCode.set('');
    RoomService.clearRooms();
    PlayerSessionService.clearUser();
  }

}
