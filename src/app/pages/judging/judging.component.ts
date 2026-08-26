import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer, Game, RoomPlayer, Vote } from '../../models/game.model';
import { PlayerSessionService } from '../../services/player-session.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-judging',
  standalone: true,
  templateUrl: './judging.component.html',
  styleUrl: './judging.component.css',
})
export class JudgingComponent {
  game: Game | null = null;
  roomname = '';
  currentIndex = 0;

  private readonly voter = PlayerSessionService.loadUser();

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    this.roomname = this.route.parent?.snapshot.paramMap.get('roomname') ?? '';
    this.game = RoomService.loadRoom(this.roomname);
  }

  get currentAnswer(): Answer | null {
    return this.game?.answers[this.currentIndex] ?? null;
  }

  get currentPlayer(): RoomPlayer | null {
    const playerId = this.currentAnswer?.playerId;
    return this.game?.players.find((player) => player.playerId === playerId) ?? null;
  }

  get currentVote(): Vote | undefined {
    return this.voter && this.currentAnswer ? this.currentAnswer.votes?.[this.voter.playerId] : undefined;
  }

  vote(vote: Vote): void {
    if (!this.voter || !this.currentAnswer) return;

    this.game = RoomService.voteForAnswer(
      this.roomname,
      this.currentAnswer.playerId,
      this.voter.playerId,
      vote,
    );
  }

  previousPlayer(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
  }

  nextPlayer(): void {
    const answerCount = this.game?.answers.length ?? 0;

    if (this.currentIndex < answerCount - 1) {
      this.currentIndex += 1;
      return;
    }

    const game = RoomService.updatePhase(this.roomname, 'waiting');

    if (game) {
      void this.router.navigate(['/room', this.roomname, 'waiting']);
    }
  }
}
