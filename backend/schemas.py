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

class CharacterCreate(BaseModel):
    name: str
    description: str
    role: str
    world_id: Optional[int] = None

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
    title: str  # Change from 'name' to 'title'
    description: Optional[str] = None
    date: Optional[str] = None  # Add date field since it exists in DB
    location_id: Optional[int] = None  # Add location_id field

class EventCreate(EventBase):
    world_id: int  # This will come from the URL path

class EventUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None
    location_id: Optional[int] = None

class Event(EventBase):
    id: int
    world_id: int
    user_id: Optional[int] = None
    
    class Config:
        from_attributes = True


# ---------------- Character ----------------
class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    role: Optional[str] = None
    description: Optional[str] = None

# ---------------- Location ----------------
class LocationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    coordinates: Optional[str] = None

# ---------------- Event ----------------
class EventUpdate(BaseModel):
    name: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None
