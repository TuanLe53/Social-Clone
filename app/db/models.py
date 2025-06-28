from sqlalchemy import Column, String, TIMESTAMP, ForeignKey, Boolean, DateTime
from sqlalchemy_utils import UUIDType
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
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