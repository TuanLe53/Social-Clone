from sqlalchemy import Column, String, TIMESTAMP, ForeignKey, Boolean
from sqlalchemy_utils import UUIDType
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import uuid

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(128), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    last_login = Column(TIMESTAMP, nullable=True)
    
    is_deleted = Column(Boolean, unique=False, default=False)
    deleted_at = Column(TIMESTAMP, nullable=True)
    
    providers = relationship("AuthProvider", back_populates="user", cascade="all, delete-orphan")

class AuthProvider(Base):
    __tablename__ = "auth_providers"
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType(binary=False), ForeignKey("users.id"))
    provider = Column(String(50), nullable=False)
    provider_id = Column(String, unique=True, index=True, nullable=False)
    user = relationship("User", back_populates="providers")
