import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_user
from models import Event, World

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/events", tags=["Events"])

# -------------------
# Create a new event
# -------------------
@router.post("/", response_model=schemas.Event)
def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verify user owns the world
    world = db.query(World).filter(
        World.id == event.world_id,
        World.user_id == current_user.id
    ).first()
    if not world:
        raise HTTPException(status_code=404, detail="World not found")

    db_event = Event(
        title=event.title,  # ✅ updated
        description=event.description,
        world_id=event.world_id,
        user_id=current_user.id
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    logger.info(f"User {current_user.username} created event '{db_event.title}' (ID: {db_event.id})")
    return db_event


# -------------------
# Create event for a specific world
# -------------------
@router.post("/world/{world_id}", response_model=schemas.Event)
def create_event_for_world(
    world_id: int,
    event: schemas.EventBase,  # expects 'title'
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verify world exists and user owns it
    world = db.query(World).filter(
        World.id == world_id,
        World.user_id == current_user.id
    ).first()
    if not world:
        raise HTTPException(status_code=404, detail="World not found")

    db_event = Event(
        title=event.title,  # ✅ updated
        description=event.description,
        date=event.date,
        location_id=event.location_id,
        world_id=world_id,
        user_id=current_user.id
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    logger.info(f"User {current_user.username} created event '{db_event.title}' in world ID {world_id}")
    return db_event


# -------------------
# Get all events for a specific world
# -------------------
@router.get("/world/{world_id}", response_model=List[schemas.Event])
def get_events_by_world(
    world_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    world = db.query(World).filter(
        World.id == world_id,
        World.user_id == current_user.id
    ).first()
    if not world:
        raise HTTPException(status_code=404, detail="World not found")

    events = db.query(Event).filter(Event.world_id == world_id).all()
    logger.info(f"User {current_user.username} fetched {len(events)} events for world '{world.name}'")
    return events


# -------------------
# Get a single event
# -------------------
@router.get("/{event_id}", response_model=schemas.Event)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event = db.query(Event).join(World).filter(
        Event.id == event_id,
        World.user_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


# -------------------
# Update an event
# -------------------
@router.put("/{event_id}", response_model=schemas.Event)
def update_event(
    event_id: int,
    event_update: schemas.EventUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event = db.query(Event).join(World).filter(
        Event.id == event_id,
        World.user_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    update_data = event_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)

    logger.info(f"User {current_user.username} updated event '{event.title}' (ID: {event.id})")
    return event


# -------------------
# Delete an event
# -------------------
@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event = db.query(Event).join(World).filter(
        Event.id == event_id,
        World.user_id == current_user.id
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()
    return
