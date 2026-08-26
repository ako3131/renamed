import { Answer, Game, GamePhase, Vote } from '../models/game.model';
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
    const game: Game = { roomName: roomCode, phase: 'waiting', answers: [], players: [] };
    saveRoom(game);
    return game;
}

// Given a code, either create or join a preexisting room
function createOrJoinRoom(roomCode: string, user: User): Game | null {
    console.log(' createing or joining room', roomCode);
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
    const isAlreadyInRoom = game.players.some(
        (player) => player.playerId === user.playerId,
    );

    if (!isAlreadyInRoom) {
        game.players.push(user);
        saveRoom(game);
    }

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

// Update the screen every player in a room should see next
function updatePhase(roomCode: string, phase: GamePhase): Game | null {
    const room = loadRoom(roomCode);

    if (!room) {
        return null;
    }

    room.phase = phase;
    saveRoom(room);
    return room;
}

// Save one answer for each player and move the room to the next phase.
function submitAnswers(roomCode: string, answers: Answer[]): Game | null {
    const room = loadRoom(roomCode);

    if (!room) {
        return null;
    }

    room.answers = answers;
    room.phase = 'judging';
    saveRoom(room);
    return room;
}

// Record one player's vote for another player's submitted responses.
function voteForAnswer(
    roomCode: string,
    answerPlayerId: string,
    voterId: string,
    vote: Vote,
): Game | null {
    const room = loadRoom(roomCode);

    if (!room) {
        return null;
    }

    const answer = room.answers.find((item) => item.playerId === answerPlayerId);

    if (!answer) {
        return null;
    }

    answer.votes ??= {};
    const previousVote = answer.votes[voterId];

    if (previousVote === vote) {
        return room;
    }

    if (previousVote === 'up') answer.score -= 1;
    if (previousVote === 'down') answer.score += 1;

    answer.votes[voterId] = vote;
    answer.score += vote === 'up' ? 1 : -1;
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
    createOrJoinRoom,
    joinRoom,
    loadRoom,
    leaveRoom,
    updatePhase,
    submitAnswers,
    voteForAnswer,
    totalGames,
    totalPlayers,
    clearRooms
};
