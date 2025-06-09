from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
from database import engine, get_db
from pydantic import BaseModel
from sqlalchemy import text

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Pydantic models for request/response validation
class UserCreate(BaseModel):
    username: str
    email: str
    full_name: str

class ItemCreate(BaseModel):
    title: str
    description: str

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Quillvania Archives API",
        "endpoints": {
            "test_db": "/test-db",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }

# Test database connection endpoint
@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        # Explicitly declare the SQL as text
        db.execute(text("SELECT 1"))
        db.commit()  # <-- Good practice for read-only queries too
        return {"status": "success", "message": "Database connection successful"}
    except Exception as e:
        # Include more detailed error information
        error_detail = {
            "error": str(e),
            "type": type(e).__name__,
            "suggestion": "Check your database connection settings"
        }
        raise HTTPException(
            status_code=500,
            detail=error_detail
        )
    

# User endpoints
@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/")
def read_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

# Item endpoints
@app.post("/items/")
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/items/")
def read_items(db: Session = Depends(get_db)):
    items = db.query(models.Item).all()
    return items