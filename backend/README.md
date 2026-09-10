# Renamed API

Run the API from this directory:

```bash
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000`.

- `GET /health` verifies that the API is running.
- `GET /api/categories/random` returns a category for the next round.
- `GET /api/categories/random?exclude=animals` returns a category other than `animals` when possible.

## Room API

- `POST /api/rooms/{roomName}/join` with `{ "playerId": "...", "username": "..." }`
- `POST /api/rooms/{roomName}/leave` with `{ "playerId": "..." }`
- `GET /api/rooms/{roomName}`
- `GET /api/rooms/stats`
- `PUT /api/rooms/{roomName}/phase` with `{ "phase": "renaming" }`
- `PUT /api/rooms/{roomName}/answers` with `{ "answers": [...] }`
- `POST /api/rooms/{roomName}/votes` with a vote request

Open `http://127.0.0.1:8000/docs` to test the API in Swagger UI.
