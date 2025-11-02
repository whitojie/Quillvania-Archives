from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/worlds", tags=["Worlds"])

@router.post("/", response_model=schemas.World)
def create_world(world: schemas.WorldCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_world = models.World(name=world.name, description=world.description, user_id=current_user.id)
    db.add(db_world)
    db.commit()
    db.refresh(db_world)
    return db_world

@router.get("/", response_model=List[schemas.World])
def get_worlds(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.World).filter(models.World.user_id == current_user.id).all()

@router.delete("/{world_id}", status_code=204)
def delete_world(world_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    world = db.query(models.World).filter(models.World.id == world_id, models.World.user_id == current_user.id).first()
    if not world:
        raise HTTPException(status_code=404, detail="World not found")
    db.delete(world)
    db.commit()
    return
