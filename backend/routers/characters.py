import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_user

# -------------------
# Setup logging
# -------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/characters", tags=["Characters"])

# -------------------
# Create a new character
# -------------------
@router.post("/", response_model=schemas.Character)
def create_character(
    character: schemas.CharacterCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_character = models.Character(
        name=character.name,
        description=character.description,
        role=character.role,
        user_id=current_user.id
    )
    db.add(db_character)
    db.commit()
    db.refresh(db_character)

    logger.info(f"User {current_user.username} created character '{db_character.name}' (ID: {db_character.id})")
    return db_character

# -------------------
# Get all characters for current user
# -------------------
@router.get("/", response_model=List[schemas.Character])
def get_characters(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    characters = db.query(models.Character).filter(models.Character.user_id == current_user.id).all()
    logger.info(f"User {current_user.username} fetched {len(characters)} characters")
    return characters

# -------------------
# Get a specific character by ID
# -------------------
@router.get("/{character_id}", response_model=schemas.Character)
def get_character(
    character_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    character = db.query(models.Character).filter(
        models.Character.id == character_id,
        models.Character.user_id == current_user.id
    ).first()
    if not character:
        logger.warning(f"User {current_user.username} tried to fetch non-existing character ID {character_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")
    logger.info(f"User {current_user.username} fetched character '{character.name}' (ID: {character.id})")
    return character

# -------------------
# Update a character
# -------------------
@router.put("/{character_id}", response_model=schemas.Character)
def update_character(
    character_id: int,
    character_update: schemas.CharacterCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    character = db.query(models.Character).filter(
        models.Character.id == character_id,
        models.Character.user_id == current_user.id
    ).first()
    if not character:
        logger.warning(f"User {current_user.username} tried to update non-existing character ID {character_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")

    character.name = character_update.name
    character.description = character_update.description
    character.role = character_update.role

    db.commit()
    db.refresh(character)
    logger.info(f"User {current_user.username} updated character '{character.name}' (ID: {character.id})")
    return character

# -------------------
# Delete a character
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
