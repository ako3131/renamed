export type GamePhase = 'waiting' | 'renaming' | 'guessing' | 'judging' | 'empty';

export type Vote = 'up' | 'down';

export interface RoomPlayer {
    playerId: string;
    username: string;
}

export interface Answer {
    playerId: string;
    answers: string[];
    score: number;
    votes: Record<string, Vote>;
}

export interface Game {
    roomName: string;
    phase: GamePhase;
    answers: Answer[];
    players: RoomPlayer[];
}
