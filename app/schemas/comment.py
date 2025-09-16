from pydantic import BaseModel, Field

class PostComment(BaseModel):
    content: str
    post_id: str = Field(alias='postId') 
    parent_id: str | None = Field(default=None, alias='parentId')