import { User } from '../models/user.model';

const USER_STORAGE_KEY = 'user';

// Load a user from local storage
function loadUser(): User | null {
    const userStateJson = localStorage.getItem(USER_STORAGE_KEY);
    if (userStateJson) {
        return JSON.parse(userStateJson) as User;
    }
    return null;
}

// Save a user to local storage
function saveUser(user: User): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

// Create a user
function createUser(username: string): User {
    const playerId = crypto.randomUUID()
    const user: User = { playerId, username: username, currentRoom: undefined };
    saveUser(user);
    return user;
}

// Remove a user (for testing)
function clearUser(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
}

// Change the username
function updateUsername(newUsername: string): void {
        const user = loadUser();
        if (user) {
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