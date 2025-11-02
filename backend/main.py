from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import users, worlds, characters, events, locations

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(worlds.router)
app.include_router(characters.router)
app.include_router(events.router)
app.include_router(locations.router)

@app.get("/")
def root():
    return {"message": "Quillvania Archives API running"}
