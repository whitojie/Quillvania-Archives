from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/events", tags=["Events"])

# Create a new event
@router.post("/", response_model=schemas.Event)
def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    world = db.query(models.World).filter(
        models.World.id == event.world_id,
        models.World.user_id == current_user.id
    ).first()

    if not world:
        raise HTTPException(status_code=404, detail="World not found or unauthorized")

    db_event = models.Event(
        name=event.name,
        description=event.description,
        world_id=event.world_id
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


# Get all events for a specific world
@router.get("/world/{world_id}", response_model=List[schemas.Event])
def get_events_for_world(
    world_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    world = db.query(models.World).filter(
        models.World.id == world_id,
        models.World.user_id == current_user.id
    ).first()

    if not world:
        raise HTTPException(status_code=404, detail="World not found or unauthorized")

    return db.query(models.Event).filter(models.Event.world_id == world_id).all()


# Delete an event
@router.delete("/{event_id}", status_code=204)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event = db.query(models.Event).join(models.World).filter(
        models.Event.id == event_id,
        models.World.user_id == current_user.id
    ).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found or unauthorized")

    db.delete(event)
    db.commit()
    return
