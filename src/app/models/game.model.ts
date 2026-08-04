export type GamePhase = 'waiting' | 'renaming' | 'guessing' | 'empty';

export interface RoomPlayer {
    playerId: string;
    username: string;
}

export interface Game {
    roomId: string;
    roomName: string;
    phase: GamePhase;
    answers: string[];
    players: RoomPlayer[];
}