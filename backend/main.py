from random import choice

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title='Renamed API', version='0.1.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:4200', 'http://127.0.0.1:4200'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class Category(BaseModel):
    id: str
    name: str
    prompt: str


CATEGORIES: tuple[Category, ...] = (
    Category(id='fruits', name='Fruits', prompt='Rename every player as a fruit.'),
    Category(id='animals', name='Animals', prompt='Rename every player as an animal.'),
    Category(id='cars', name='Cars', prompt='Rename every player as a car.'),
    Category(id='movies', name='Movies', prompt='Rename every player as a movie.'),
    Category(id='jobs', name='Jobs', prompt='Rename every player as a job.'),
    Category(id='countries', name='Countries', prompt='Rename every player as a country.'),
    Category(
        id='mythical-creatures',
        name='Mythical creatures',
        prompt='Rename every player as a mythical creature.',
    ),
)

@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}


@app.get('/api/categories/random', response_model=Category)
def random_category(exclude: str | None = None) -> Category:
    available_categories = tuple(category for category in CATEGORIES if category.id != exclude)
    return choice(available_categories or CATEGORIES)
