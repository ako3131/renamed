from models import Answer, Game, GamePhase, Player, Vote

CURRENT_ROOMS: dict[str, Game] = {}


def load_room(room_code: str) -> Game | None:
	return CURRENT_ROOMS.get(room_code)


def create_room(room_code: str) -> Game:
	room = Game(roomName=room_code)
	CURRENT_ROOMS[room_code] = room
	return room


def create_or_join_room(room_code: str, player: Player) -> Game:
    existing_room = load_room(room_code)

    if existing_room is not None:
        return join_room(existing_room, player)

    new_room = create_room(room_code)
    return join_room(new_room, player)


def join_room(room: Game, player: Player) -> Game:
    already_in_room = any(
        existing_player.playerId == player.playerId
        for existing_player in room.players
    )

    if not already_in_room:
        player.currentRoom = room.roomName
        room.players.append(player)

    return room


def leave_room(room_code: str, player_id: str) -> Game | None:
	room = load_room(room_code)

	if room is None:
		return None

	room.players = [player for player in room.players if str(player.playerId) != player_id]

	if not room.players:
		close_room(room_code)
		return None

	return room


def update_phase(room_code: str, phase: GamePhase) -> Game | None:
	room = load_room(room_code)

	if room is not None:
		room.phase = phase

	return room


def submit_answers(room_code: str, answers: list[Answer]) -> Game | None:
	room = load_room(room_code)

	if room is not None:
		room.answers = answers
		room.phase = GamePhase.JUDGING

	return room


def vote_for_answer(
	room_code: str,
	answer_player_id: str,
	voter_id: str,
	vote: Vote,
) -> Game | None:
	room = load_room(room_code)

	if room is None:
		return None

	answer = next(
		(item for item in room.answers if str(item.playerId) == answer_player_id),
		None,
	)

	if answer is None:
		return None

	previous_vote = answer.votes.get(voter_id)

	if previous_vote == vote:
		return room

	if previous_vote == Vote.UP:
		answer.score -= 1
	elif previous_vote == Vote.DOWN:
		answer.score += 1

	answer.votes[voter_id] = vote
	answer.score += 1 if vote == Vote.UP else -1
	return room


def close_room(room_code: str) -> None:
	CURRENT_ROOMS.pop(room_code, None)


def total_games() -> int:
	return len(CURRENT_ROOMS)


def total_players() -> int:
	return sum(len(room.players) for room in CURRENT_ROOMS.values())


def clear_rooms() -> None:
	CURRENT_ROOMS.clear()

