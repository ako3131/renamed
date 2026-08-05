import { Game } from '../models/game.model';
import { User } from '../models/user.model';

type RoomMap = Record<string, Game>;

const ROOM_STORAGE_KEY = 'rooms';

// Load preexisting rooms from local storage
function loadRooms(): RoomMap {
    const roomsJson = localStorage.getItem(ROOM_STORAGE_KEY);

    if (!roomsJson) {
        return {};
    }

    try {
        const parsedRooms = JSON.parse(roomsJson) as RoomMap;
        return parsedRooms && typeof parsedRooms === 'object' ? parsedRooms : {};
    } catch {
        return {};
    }
}

// Save all rooms into local storage
function saveRooms(rooms: RoomMap): void {
    localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(rooms));
}

// Add a room into the room map
function saveRoom(game: Game): void {
    const rooms = loadRooms();
    rooms[game.roomName] = game;
    saveRooms(rooms);
}

// Load a room via code
function loadRoom(roomCode: string): Game | null {
    const rooms = loadRooms();
    return rooms[roomCode] ?? null;
}

// Create a new room
function createRoom(roomCode: string): Game | null {
    const roomId = crypto.randomUUID();
    const game: Game = { roomId, roomName: roomCode, phase: 'waiting', answers: [], players: [] };
    saveRoom(game);
    return game;
}

// Given a code, either create or join a preexisting room
function createOrJoinRoom(roomCode: string, user: User): Game | null {
    const existingRoom = loadRoom(roomCode);

    if (existingRoom) {
        return joinRoom(existingRoom, user);
    }

    const newRoom = createRoom(roomCode);

    if (!newRoom) {
        return null;
    }

    return joinRoom(newRoom, user);
}

// Add a user to a game's player list
function joinRoom(game: Game, user: User): Game {
    game.players.push(user);
    saveRoom(game);
    return game;
}

// Remove a user from a game's player list, if the game is empty delete it
function leaveRoom(roomCode: string, playerId: string): Game | null {
    const room = loadRoom(roomCode);

    if (!room) {
        return null;
    }

    room.players = room.players.filter((player) => player.playerId !== playerId);

    if (room.players.length === 0) {
        closeRoom(roomCode);
        return null;
    }

    saveRoom(room);
    return room;
}

// Close a room
function closeRoom(roomCode: string): void {
    const rooms = loadRooms();
    delete rooms[roomCode];
    saveRooms(rooms);
}

// Get total active games
function totalGames(): number {
    const rooms = loadRooms();
    return Object.keys(rooms).length;
}

// Get number of players in all games
function totalPlayers(): number {
    const rooms = loadRooms();
    let playerCount = 0;

    for (const room of Object.values(rooms)) {
        playerCount += room.players.length;
    }

    return playerCount;
}

// Delete rooms (for testing)
function clearRooms(): void {
    localStorage.removeItem(ROOM_STORAGE_KEY);
}

export const RoomService = {
    loadRoom,
    saveRoom,
    createRoom,
    createOrJoinRoom,
    joinRoom,
    leaveRoom,
    closeRoom,
    totalGames,
    totalPlayers,
    clearRooms
};