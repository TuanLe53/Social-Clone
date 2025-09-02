from sqlalchemy.orm import Session, joinedload
from app.db.models import Post, User, PostImage, LikePost
from fastapi import HTTPException

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

def get_post_by_id(db_session: Session, post_id: str) -> Post | None:
    return db_session.query(Post)\
        .options(joinedload(Post.images), joinedload(Post.creator))\
        .filter(Post.id == post_id)\
        .first()

def get_posts_by_user_id(db_session: Session, user_id: str, limit: int, offset: int) -> list[Post]:
    return db_session.query(Post)\
        .options(joinedload(Post.images), joinedload(Post.creator))\
        .filter(Post.created_by == user_id)\
        .order_by(Post.created_at.desc())\
        .limit(limit)\
        .offset(offset)\
        .all()

def has_liked_post(post: Post, user: User) -> bool:
    """
    Checks if a user has liked a post.

    Args:
        post (Post): The post to check.
        user (User): The user to verify.

    Returns:
        bool: True if the user has liked the post, False otherwise.
    """
    return any(like.user_id == user.id for like in post.liked_by_users)

def like_post(db_session: Session, post: Post, user: User) -> Post:
    """
    Allows a user to like a post.

    Args:
        db_session (Session): The database session.
        post (Post): The post to like.
        user (User): The user who is liking the post.

    Returns:
        Post: The updated Post object.

    """

    if has_liked_post(post, user):
        return post

    like = LikePost(user=user, post=post)
    post.liked_by_users.append(like)
    post.like_count += 1
    
    db_session.commit()
    db_session.refresh(post)

    return post

def unlike_post(db_session: Session, post: Post, user: User) -> Post:
    """
    Allows a user to unlike a post.

    Args:
        db_session (Session): The database session.
        post (Post): The post to unlike.
        user (User): The user who is unliking the post.

    Returns:
        Post: The updated Post object.
    """

    like_entry = next(
        (like for like in post.liked_by_users if like.user_id == user.id),
        None
    )

    if not like_entry:
        return post

    post.liked_by_users.remove(like_entry)
    post.like_count = max(post.like_count - 1, 0)

    db_session.commit()
    db_session.refresh(post)

    return post