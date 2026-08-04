export type GamePhase = 'waiting' | 'renaming' | 'guessing' | 'empty';

export interface Game {
    roomId: string;
    roomName: string;
    phase: GamePhase;
    answers: string[];
}