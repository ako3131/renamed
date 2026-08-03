import { UserState } from '../models/user.model';

function loadUserState(): UserState | null {
    const userStateJson = localStorage.getItem('userState');
    if (userStateJson) {
        return JSON.parse(userStateJson) as UserState;
    }
    return null;
}

function saveUserState(userState: UserState): void {
    localStorage.setItem('userState', JSON.stringify(userState));
}

function createUserState(): UserState {
    const playerId = crypto.randomUUID();
    const username = `Player-${playerId.slice(0, 8)}`;
    const userState: UserState = { playerId, username };
    saveUserState(userState);
    return userState;
}

function clearUserState(): void {
    localStorage.removeItem('userState');
}

export const PlayerSessionService = {
    loadUserState,
    saveUserState,
    createUserState,
    clearUserState,
};