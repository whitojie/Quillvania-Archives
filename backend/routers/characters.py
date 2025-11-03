import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_user
from schemas import CharacterUpdate
from typing import Any


# -------------------
# Logging setup
# -------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/characters", tags=["Characters"], include_in_schema=True)

# -------------------
# Create Character for a Specific World
# -------------------

@router.post("/world/{world_id}", response_model=schemas.Character)
def create_character_for_world(
    world_id: int,
    character: schemas.CharacterCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Optional: verify the world belongs to the user
    world = db.query(models.World).filter(models.World.id == world_id).first()
    if not world:
        raise HTTPException(status_code=404, detail="World not found")
    if world.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to add characters to this world")

    # Create character
    db_character = models.Character(
        name=character.name,
        description=character.description,
        role=character.role,
        world_id=world_id  # only include world_id
    )
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    return db_character

# -------------------
# Get All Characters in a World
# -------------------
@router.get("/world/{world_id}", response_model=List[schemas.Character])
def get_characters_by_world(
    world_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verify ownership of the world
    world = db.query(models.World).filter(
        models.World.id == world_id,
        models.World.user_id == current_user.id
    ).first()

    if not world:
        logger.warning(f"User {current_user.username} tried to access characters for unauthorized world ID {world_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="World not found or not yours")

    characters = db.query(models.Character).filter(models.Character.world_id == world_id).all()
    logger.info(f"User {current_user.username} fetched {len(characters)} characters from world '{world.name}'")
    return characters


# -------------------
# Get a Specific Character by ID
# -------------------
@router.get("/{char_id}", response_model=schemas.Character)
def get_character(
    char_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Get the character and ensure the current user owns the world
    character = (
        db.query(models.Character)
        .join(models.World)
        .filter(models.Character.id == char_id)
        .filter(models.World.user_id == current_user.id)  # check ownership via the world
        .first()
    )
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character


# -------------------
# Update Character
# -------------------
@router.put("/{character_id}")  # Fixed: removed duplicate "characters" prefix
def update_character(
    character_id: int,  # Fixed: parameter name matches path parameter
    character_update: schemas.CharacterUpdate,  # Fixed: added schemas prefix
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # Fixed: proper type annotation
):
    # Get character and verify ownership via world
    character = (
        db.query(models.Character)
        .join(models.World)
        .filter(models.Character.id == character_id)
        .filter(models.World.user_id == current_user.id)
        .first()
    )
    
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    
    # Update only provided fields
    update_data = character_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(character, key, value)
    
    db.commit()
    db.refresh(character)
    
    logger.info(f"User {current_user.username} updated character '{character.name}' (ID: {character.id})")
    return character

# -------------------
# Delete Character
# -------------------
@router.delete("/{character_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_character(
    character_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    character = db.query(models.Character).filter(
        models.Character.id == character_id,
        models.Character.user_id == current_user.id
    ).first()

    if not character:
        logger.warning(f"User {current_user.username} tried to delete non-existing character ID {character_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")

    db.delete(character)
    db.commit()

    logger.info(f"User {current_user.username} deleted character '{character.name}' (ID: {character.id})")
    return
