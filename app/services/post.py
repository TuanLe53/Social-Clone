from sqlalchemy.orm import Session
from app.db.models import Post, User, PostImage

STATIC_URL = "http://127.0.0.1:8000/static/post_photos/"

def create_post(
    db_session: Session,
    content: str,
    user: User,
    photos: list[str]
) -> Post:
    
    post = Post(
        content=content,
        created_by = user.id
    )
    
    for photo in photos:
        post_image = PostImage(
            image_url = STATIC_URL + photo
        )
        post.images.append(post_image)
    
    
    db_session.add(post)
    db_session.commit()
    db_session.refresh(post)
    
    return post

