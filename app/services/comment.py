from sqlalchemy.orm import Session
from app.db.models import Comment, User

def create_comment(
    db_session: Session,
    content: str,
    user: User,
    post_id: str,
    parent_id: str | None = None
) -> Comment:
    comment = Comment(
        content=content,
        created_by=user.id,
        post_id=post_id,
        parent_id=parent_id
    )
    
    db_session.add(comment)
    db_session.commit()
    db_session.refresh(comment)
    
    return comment

def is_comment_exists(
    db_session: Session,
    comment_id: str
) -> bool:
    return db_session.query(Comment).filter(Comment.id == comment_id).first() is not None