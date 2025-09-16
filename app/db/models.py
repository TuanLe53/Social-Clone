from sqlalchemy import Column, String, TIMESTAMP, ForeignKey, Boolean, DateTime, Text, Integer
from sqlalchemy_utils import UUIDType
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, backref
from app.db.database import Base
import uuid

class Follow(Base):
    __tablename__ = "follows"
    follower_id = Column(UUIDType(binary=False), ForeignKey("users.id"), primary_key=True)
    following_id = Column(UUIDType(binary=False), ForeignKey("users.id"), primary_key=True)
    
class User(Base):
    __tablename__ = "users"
    
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), nullable=False, unique=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(128), nullable=True)
    
    avatar_url = Column(String(500), nullable=True) 
    
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    last_login = Column(TIMESTAMP, nullable=True)
    is_private = Column(Boolean, default=False, nullable=False)
    
    is_deleted = Column(Boolean, unique=False, default=False)
    deleted_at = Column(TIMESTAMP, nullable=True)
    
    providers = relationship("AuthProvider", back_populates="user", cascade="all, delete-orphan")
    following = relationship("User",
            secondary="follows",
            primaryjoin=id == Follow.follower_id,
            secondaryjoin=id == Follow.following_id,
            backref="followers",
        )
    liked_posts = relationship("LikePost", back_populates="user")

class AuthProvider(Base):
    __tablename__ = "auth_providers"
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType(binary=False), ForeignKey("users.id"))
    provider = Column(String(50), nullable=False)
    provider_id = Column(String, unique=True, index=True, nullable=False)
    user = relationship("User", back_populates="providers")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType(binary=False), ForeignKey("users.id"))
    expires = Column(DateTime, nullable=False)
    
class Post(Base):
    __tablename__ = "posts"
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=True)
        
    like_count = Column(Integer, default=0, nullable=False)
    comment_count = Column(Integer, default=0, nullable=False)
    share_count = Column(Integer, default=0, nullable=False)
    
    created_by = Column(UUIDType(binary=False), ForeignKey("users.id"))
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    
    creator = relationship("User", backref="posts")
    images = relationship("PostImage", back_populates="post", cascade="all, delete-orphan")
    liked_by_users = relationship("LikePost", back_populates="post", cascade="all, delete-orphan")
    
class PostImage(Base):
    __tablename__ = "post_images"
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUIDType(binary=False), ForeignKey("posts.id"))
    image_url = Column(String(500), nullable=False)
    
    post = relationship("Post", back_populates="images")
    
class LikePost(Base):
    __tablename__ = "like_posts"
    
    user_id = Column(UUIDType(binary=False), ForeignKey("users.id"), primary_key=True)
    post_id = Column(UUIDType(binary=False), ForeignKey("posts.id"), primary_key=True)
    
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    
    user = relationship("User", back_populates="liked_posts")
    post = relationship("Post", back_populates="liked_by_users")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    
    parent_id = Column(UUIDType(binary=False), ForeignKey("comments.id"), nullable=True)
    children = relationship(
        "Comment",
        backref=backref('parent', remote_side=[id]),
        cascade="all, delete-orphan"
    )
    
    post_id = Column(UUIDType(binary=False), ForeignKey("posts.id"))
    created_by = Column(UUIDType(binary=False), ForeignKey("users.id"))
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    