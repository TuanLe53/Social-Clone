from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.comment import create_comment as create_comment_service, is_comment_exists
from app.services.post import get_post_by_id
from app.db.models import User
from app.dependencies import get_current_user
from app.db.database import get_db
from app.schemas.comment import PostComment

router = APIRouter(
    prefix="/comment",
)

@router.post("/")
async def create_comment(comment_form: PostComment, user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    post = get_post_by_id(db, comment_form.post_id)
    if not post:
        raise HTTPException(status_code=400, detail="Post not found")
    
    if comment_form.parent_id:
        parent_comment = is_comment_exists(db, comment_form.parent_id)
        if not parent_comment:
            raise HTTPException(status_code=400, detail="Parent comment not found")
        
    comment = create_comment_service(
        db_session=db,
        content=comment_form.content,
        user=user,
        post_id=comment_form.post_id,
        parent_id=comment_form.parent_id
    )
    
    return comment