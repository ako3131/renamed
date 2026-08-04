export type SessionPhase = 'login' | 'lobby' | 'game';

export interface session {
    phase: SessionPhase;
}