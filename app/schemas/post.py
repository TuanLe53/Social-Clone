from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from .user import UserProfile

class PostImageSchema(BaseModel):
    id: UUID
    image_url: str
    post_id: UUID
    
class PostSchema(BaseModel):
    id: UUID
    content: str | None
    
    like_count: int
    comment_count: int
    share_count: int
    
    created_at: datetime
    
    creator: UserProfile
    
    images: list[PostImageSchema] = []
    