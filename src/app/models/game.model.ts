export type GamePhase = 'login' | 'lobby' | 'waiting' | 'rename' | 'guess' | 'reveal' | 'finished';

export interface GameState {
    roomId: string;
    roomName: string;
    phase: GamePhase;
    answers: string[];
}