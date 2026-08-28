import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Game, RoomPlayer, Answer } from '../../models/game.model';
import { RoomService } from '../../services/room.service';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-gameplay',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gameplay.component.html',
  styleUrl: './gameplay.component.css',
})
export class GameplayComponent implements OnInit, OnDestroy {
  game: Game | null = null;
  roomname = '';
  players: RoomPlayer[] = [];
  answers: Record<string, Answer> = {};
  readonly secondsRemaining = signal(5);
  readonly timerLabel = computed(() => {
    const secondsRemaining = this.secondsRemaining();
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = String(secondsRemaining % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  });
  finished = false;
  readonly category = signal<Category | null>(null);
  readonly categoryError = signal(false);

  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly categoryService: CategoryService
  ) {
    this.roomname = this.route.parent?.snapshot.paramMap.get('roomname') ?? '';
    this.game = RoomService.loadRoom(this.roomname);
    this.players = this.game?.players ?? [];
    this.answers = Object.fromEntries(
      this.players.map(
        (player): [string, Answer] => [
          player.playerId,
          { playerId: player.playerId, answers: [''], score: 0, votes: {} },
        ],
      ),
    );
    this.loadCategory();
  }
  
  

  ngOnInit(): void {
    this.timerId = setInterval(() => {
      this.secondsRemaining.update((seconds) => Math.max(seconds - 1, 0));

      if (this.secondsRemaining() === 0) {
        this.finishGame();
      }
    }, 1_000);
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  finishGame(): void {
    if (this.finished) return;

    this.finished = true;
    this.stopTimer();

    const answers = this.players.map((player) => this.answers[player.playerId]);

    const game = RoomService.submitAnswers(this.roomname, answers);

    if (game) {
      void this.router.navigate(['/room', this.roomname, 'judging']);
    }
  };

  returnToWaitingRoom(): void {
    const game = RoomService.updatePhase(this.roomname, 'waiting');

    if (game) {
      void this.router.navigate(['/room', this.roomname, 'waiting']);
    }
  };

  private stopTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  };

  private loadCategory(): void {
  this.categoryService.getRandomCategory().subscribe({
      next: (category) => this.category.set(category),
      error: (error) => {
          console.error('Category request failed', error);
          this.categoryError.set(true);
      },
  });
  }
}
