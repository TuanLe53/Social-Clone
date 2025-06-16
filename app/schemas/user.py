from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
class RegisterUser(BaseModel):
    email: EmailStr
    username: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="The unique username for the user.")
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="The user's password. Must be at least 8 characters long."
    )

class LoginUser(BaseModel):
    email: EmailStr
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="The user's password. Must be at least 8 characters long."
    )

class TokenData(BaseModel):
    id: str | None = None
    
class Token(BaseModel):
    access_token: str
    token_type: str
    
class UserProfile(BaseModel):
    id: UUID
    username: str
    avatar_url: str | None = None
    