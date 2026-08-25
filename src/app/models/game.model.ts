export type GamePhase = 'waiting' | 'renaming' | 'guessing' | 'empty';

export interface RoomPlayer {
    playerId: string;
    username: string;
}

export interface Game {
    roomName: string;
    phase: GamePhase;
    answers: string[];
    players: RoomPlayer[];
}