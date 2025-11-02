from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/locations", tags=["Locations"])

# Create a new location inside a specific world
@router.post("/", response_model=schemas.Location)
def create_location(
    location: schemas.LocationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Ensure the world belongs to the current user
    world = db.query(models.World).filter(
        models.World.id == location.world_id,
        models.World.user_id == current_user.id
    ).first()

    if not world:
        raise HTTPException(status_code=404, detail="World not found or unauthorized")

    db_location = models.Location(
        name=location.name,
        description=location.description,
        world_id=location.world_id
    )
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location


# Get all locations for a specific world
@router.get("/world/{world_id}", response_model=List[schemas.Location])
def get_locations_for_world(
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

    return db.query(models.Location).filter(models.Location.world_id == world_id).all()


# Delete a location
@router.delete("/{location_id}", status_code=204)
def delete_location(
    location_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    location = db.query(models.Location).join(models.World).filter(
        models.Location.id == location_id,
        models.World.user_id == current_user.id
    ).first()

    if not location:
        raise HTTPException(status_code=404, detail="Location not found or unauthorized")

    db.delete(location)
    db.commit()
    return
