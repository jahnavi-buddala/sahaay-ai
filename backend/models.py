import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="user") # "user" or "admin"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    reports = relationship("Report", back_populates="user")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=lambda: f"SHY-{uuid.uuid4().hex[:6].upper()}")
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    hazard_type = Column(String, nullable=False) # Waterlogging, Flooded Road, Road Obstruction, Damaged Road, Other
    title = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    observed_severity = Column(String, default="medium") # low, medium, high
    is_anonymous = Column(Boolean, default=False)
    
    # Status: unverified, corroborated, verified, resolved, stale
    status = Column(String, default="unverified")
    duplicate_group_id = Column(String, nullable=True)
    
    # AI Vision Analysis JSON
    # { "predicted_labels": [...], "confidence": 0.85, "interpretation": "...", "status": "completed", "limitations": "...", "human_reviewed": false }
    ai_analysis = Column(JSON, nullable=True)
    
    # Weather Context JSON
    # { "precipitation_mm": 12.4, "rain_probability": 85, "weather_code": 63, "timestamp": "...", "source": "Open-Meteo" }
    weather_context = Column(JSON, nullable=True)
    
    # Explainable Risk Scoring
    risk_score = Column(Integer, default=25) # 0 to 100
    risk_level = Column(String, default="Limited evidence") # Limited evidence, Use caution, Elevated concern
    risk_breakdown = Column(JSON, nullable=True)
    # { "visual": 18, "corroboration": 15, "rainfall": 14, "freshness": 15, "location_quality": 8, "factors": [...], "missing_data": [...] }
    
    review_notes = Column(Text, nullable=True)
    reviewer_id = Column(String, nullable=True)
    flags_count = Column(Integer, default=0)
    is_demo_data = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reports")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String, nullable=False, index=True)
    user_email = Column(String, nullable=False)
    action = Column(String, nullable=False) # verified, corroborated, resolved, stale, merged, updated, flagged
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SystemConfig(Base):
    __tablename__ = "system_configs"

    key = Column(String, primary_key=True)
    value = Column(JSON, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
