import { Game } from '../models/game.model';

type RoomMap = Record<string, Game>;

const ROOM_STORAGE_KEY = 'roomsStates';

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

function createRoom(roomCode: string): Game {
    const roomId = crypto.randomUUID();
    const normalizedRoomCode = normalizeRoomCode(roomCode) || `Room-${roomId.slice(0, 8)}`;
    const game: Game = { roomId, roomName: normalizedRoomCode, phase: 'waiting', answers: [] };
    saveRoom(game);
    return game;
}

function createOrJoinRoom(roomCode: string): Game {
    const normalizedRoomCode = normalizeRoomCode(roomCode);
    const existingRoom = loadRoom(normalizedRoomCode);

    if (existingRoom) {
        return existingRoom;
    }

    return createRoom(normalizedRoomCode);
}

function normalizeRoomCode(roomCode: string): string {
    return roomCode.trim();
}

export const RoomService = {
    loadRoom,
    saveRoom,
    createRoom,
    createOrJoinRoom
};