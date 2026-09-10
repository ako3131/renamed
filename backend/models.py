from pydantic import BaseModel
from uuid import UUID
from enum import Enum

class GamePhase(str, Enum):
    WAITING = 'waiting'
    RENAMING = 'renaming'
    GUESSING = 'guessing'
    JUDGING = 'judging'
    EMPTY = 'empty'

class Vote(str, Enum):
    UP = 'up'
    DOWN = 'down'

class Player(BaseModel):
    playerId: UUID
    username: str
    currentRoom: str | None = None

class Answer(BaseModel):
    playerId: UUID
    answers: list[str]
    score: int = 0
    votes: dict[str, Vote] = {}

class Game(BaseModel):
    roomName: str
    phase: GamePhase = GamePhase.WAITING
    answers: list[Answer] = []
    players: list[Player] = []

class Category(BaseModel):
    id: str
    name: str
    prompt: str