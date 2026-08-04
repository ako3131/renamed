import { User } from '../models/user.model';

const USER_STORAGE_KEY = 'users';

function loadUser(): User | null {
    const userStateJson = localStorage.getItem(USER_STORAGE_KEY);
    if (userStateJson) {
        return JSON.parse(userStateJson) as User;
    }
    return null;
}

function saveUser(user: User): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

function createUser(username: string = ''): User {
    const playerId = crypto.randomUUID();
    const normalizedUsername = normalizeUsername(username, playerId);
    const user: User = { playerId, username: normalizedUsername, currentRoom: undefined };
    saveUser(user);
    return user;
}

function clearUser(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
}

function normalizeUsername(username: string, playerId: string): string {
    const normalisedUsername = username.trim();
    if (!normalisedUsername) {
        return `Player-${playerId.slice(0, 8)}`;
    }
    return normalisedUsername;
}

function updateUsername(newUsername: string): void {
    const user = loadUser();
    if (user) {
        newUsername = normalizeUsername(newUsername, user.playerId);
        user.username = newUsername;
        saveUser(user);
    }
}

export const PlayerSessionService = {
    loadUser,
    saveUser,
    createUser,
    clearUser,
    updateUsername
};