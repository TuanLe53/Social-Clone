from typing import Annotated
from fastapi import APIRouter, UploadFile, Form, Depends
from sqlalchemy.orm import Session

from app.services.post import create_post as create_post_service, get_posts_by_user_id
from app.db.models import User
from app.dependencies import get_current_user
from app.db.database import get_db
from app.schemas.post import PostSchema

import os
import shutil

UPLOAD_DIRECTORY = "./app/statics/post_photos"

os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

router = APIRouter(
    prefix="/post",
)

@router.post("/")
async def create_post(user: Annotated[User, Depends(get_current_user)], content: Annotated[str, Form()], photos: list[UploadFile],  db: Session = Depends(get_db)):
    saved_filenames = []

    for photo in photos:
        file_path = os.path.join(UPLOAD_DIRECTORY, photo.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
            
        saved_filenames.append(photo.filename)
        
    post = create_post_service(
        db_session=db,
        content=content,
        user=user,
        photos=saved_filenames
    )
    
    return post

@router.get("/user/{user_id}", response_model=list[PostSchema])
async def get_posts_by_user(user_id: str, limit: int = 10, offset: int = 0, db: Session = Depends(get_db)):
    posts = get_posts_by_user_id(db_session=db, user_id=user_id, limit=limit, offset=offset)
    return posts