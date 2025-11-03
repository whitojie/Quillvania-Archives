import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_user
from models import Location, World

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/locations", tags=["Locations"])

# -------------------
# Create a new location
# -------------------
@router.post("/", response_model=schemas.Location)
def create_location(
    location: schemas.LocationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verify world ownership
    world = db.query(World).filter(
        World.id == location.world_id,
        World.user_id == current_user.id
    ).first()
    if not world:
        raise HTTPException(status_code=404, detail="World not found")

    db_location = Location(
        name=location.name,
        description=location.description,
        world_id=location.world_id
    )
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    logger.info(f"User {current_user.username} created location '{db_location.name}' (ID: {db_location.id})")
    return db_location


# -------------------
# Get all locations for a specific world
# -------------------
@router.get("/world/{world_id}", response_model=List[schemas.Location])
def get_locations_by_world(
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

    locations = db.query(Location).filter(Location.world_id == world_id).all()
    logger.info(f"User {current_user.username} fetched {len(locations)} locations for world '{world.name}'")
    return locations


# -------------------
# Get a single location
# -------------------
@router.get("/{location_id}", response_model=schemas.Location)
def get_location(
    location_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    location = db.query(Location).join(World).filter(
        Location.id == location_id,
        World.user_id == current_user.id
    ).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location


# -------------------
# Update a location
# -------------------
@router.put("/{location_id}", response_model=schemas.Location)
def update_location(
    location_id: int,
    location_update: schemas.LocationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    location = db.query(Location).join(World).filter(
        Location.id == location_id,
        World.user_id == current_user.id
    ).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    update_data = location_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(location, key, value)

    db.commit()
    db.refresh(location)

    logger.info(f"User {current_user.username} updated location '{location.name}' (ID: {location.id})")
    return location


# -------------------
# Delete a location
# -------------------
@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_location(
    location_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    location = db.query(Location).join(World).filter(
        Location.id == location_id,
        World.user_id == current_user.id
    ).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    db.delete(location)
    db.commit()
    return
