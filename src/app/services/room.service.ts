import { Game } from '../models/game.model';
import { User } from '../models/user.model';

type RoomMap = Record<string, Game>;

const ROOM_STORAGE_KEY = 'rooms';

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

function saveRooms(rooms: RoomMap): void {
    localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(rooms));
}

function saveRoom(game: Game): void {
    const rooms = loadRooms();
    rooms[game.roomName] = game;
    saveRooms(rooms);
}

function loadRoom(roomCode: string): Game | null {
    const rooms = loadRooms();
    return rooms[normalizeRoomCode(roomCode)] ?? null;
}

function createRoom(roomCode: string): Game | null {
    const roomId = crypto.randomUUID();
    const normalizedRoomCode = normalizeRoomCode(roomCode);

    if (!normalizedRoomCode) {
        return null;
    }

    const game: Game = { roomId, roomName: normalizedRoomCode, phase: 'waiting', answers: [], players: [] };
    saveRoom(game);
    return game;
}

function createOrJoinRoom(roomCode: string, user: User): Game | null {
    const normalizedRoomCode = normalizeRoomCode(roomCode);

    if (!normalizedRoomCode) {
        return null;
    }

    const existingRoom = loadRoom(normalizedRoomCode);

    if (existingRoom) {
        return joinRoom(existingRoom, user);
    }

    const newRoom = createRoom(normalizedRoomCode);

    if (!newRoom) {
        return null;
    }

    return joinRoom(newRoom, user);
}

function normalizeRoomCode(roomCode: string): string {
    return roomCode.trim();
}

function joinRoom(game: Game, user: User): Game {
    const existingPlayerIndex = game.players.findIndex((player) => player.playerId === user.playerId);

    if (existingPlayerIndex >= 0) {
        game.players[existingPlayerIndex] = user;
    } else {
        game.players.push(user);
    }

    saveRoom(game);
    return game;
}

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

function closeRoom(roomCode: string): void {
    const rooms = loadRooms();
    delete rooms[roomCode];
    saveRooms(rooms);
}

function totalGames(): number {
    const rooms = loadRooms();
    return Object.keys(rooms).length;
}

function totalPlayers(): number {
    const rooms = loadRooms();
    let playerCount = 0;

    for (const room of Object.values(rooms)) {
        playerCount += room.players.length;
    }

    return playerCount;
}

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