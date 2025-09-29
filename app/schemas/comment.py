from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from app.schemas.user import UserProfile

class PostComment(BaseModel):
    content: str
    post_id: str = Field(alias='postId') 
    parent_id: str | None = Field(default=None, alias='parentId')
    
class Comment(BaseModel):
    id: UUID
    content: str
    created_at: datetime
    user: UserProfile
    post_id: UUID
    parent_id: UUID | None = None
    
    class Config:
        from_attributes = True