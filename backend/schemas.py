# schemas.py
from pydantic import BaseModel
from typing import Optional

# -------------------
# User schemas
# -------------------
class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True  # Pydantic v2 replacement for orm_mode

# -------------------
# Login schema
# -------------------
class LoginSchema(BaseModel):
    username_or_email: str
    password: str

# -------------------
# World schema
# -------------------

class WorldBase(BaseModel):
    name: str
    description: Optional[str] = None

class WorldCreate(WorldBase):
    pass

class World(WorldBase):
    id: int
    class Config:
        from_attributes = True

# -------------------
# World Elements schema
# -------------------

class CharacterBase(BaseModel):
    name: str
    description: Optional[str] = None
    role: Optional[str] = None

class CharacterCreate(CharacterBase):
    world_id: int

class Character(CharacterBase):
    id: int
    world_id: int
    class Config:
        from_attributes = True

class LocationBase(BaseModel):
    name: str
    description: Optional[str] = None

class LocationCreate(LocationBase):
    world_id: int

class Location(LocationBase):
    id: int
    world_id: int
    class Config:
        from_attributes = True


class EventBase(BaseModel):
    name: str
    description: Optional[str] = None

class EventCreate(EventBase):
    world_id: int

class Event(EventBase):
    id: int
    world_id: int
    class Config:
        from_attributes = True
