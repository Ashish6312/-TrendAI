from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    bio = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SearchHistory(Base):
    __tablename__ = "search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=True)
    area = Column(String, index=True)
    analysis = Column(String)
    recommendations = Column(JSON) # Store list of dicts for recommendations
    created_at = Column(DateTime(timezone=True), server_default=func.now())
