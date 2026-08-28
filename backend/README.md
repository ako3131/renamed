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

Open `http://127.0.0.1:8000/docs` to test the API in Swagger UI.
