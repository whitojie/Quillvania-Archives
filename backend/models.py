from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)

    # A user can own multiple worlds
    worlds = relationship("World", back_populates="owner", cascade="all, delete-orphan")


class World(Base):
    __tablename__ = "worlds"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    owner = relationship("User", back_populates="worlds")
    characters = relationship("Character", back_populates="world", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="world", cascade="all, delete-orphan")
    locations = relationship("Location", back_populates="world", cascade="all, delete-orphan")


class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    role = Column(String)
    world_id = Column(Integer, ForeignKey("worlds.id"))

    world = relationship("World", back_populates="characters")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    world_id = Column(Integer, ForeignKey("worlds.id"))

    world = relationship("World", back_populates="events")


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    world_id = Column(Integer, ForeignKey("worlds.id"))

    world = relationship("World", back_populates="locations")
