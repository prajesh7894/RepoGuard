from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
import datetime
from database import Base

class Repository(Base):
    __tablename__ = "Repository"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    orgId = Column(Integer, ForeignKey("Organization.id"), nullable=True)
    name = Column(String)
    url = Column(String, nullable=True)
    lang = Column(String)
    status = Column(String)
    score = Column(Integer)
    scoreColor = Column(String)
    isScanning = Column(Boolean, default=False)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="repositories")
    scans = relationship("Scan", back_populates="repository")

class Scan(Base):
    __tablename__ = "Scan"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    repoId = Column(Integer, ForeignKey("Repository.id"))
    critical = Column(Integer, default=0)
    high = Column(Integer, default=0)
    secrets = Column(Integer, default=0)
    status = Column(String, default="completed")
    findingsDetail = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)

    repository = relationship("Repository", back_populates="scans")

class User(Base):
    __tablename__ = "User"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String, nullable=True)
    preferences = Column(String, nullable=True)
    githubToken = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    sessions = relationship("Session", back_populates="user")
    organizations = relationship("OrganizationMember", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Notification(Base):
    __tablename__ = "Notification"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    userId = Column(Integer, ForeignKey("User.id"))
    type = Column(String) # 'critical', 'success', 'info', 'warning', 'system'
    title = Column(String)
    message = Column(String)
    unread = Column(Boolean, default=True)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class Session(Base):
    __tablename__ = "Session"

    id = Column(String, primary_key=True, index=True) # cuid in Prisma, stored as string
    userId = Column(Integer, ForeignKey("User.id"))
    token = Column(String, unique=True, index=True)
    expiresAt = Column(DateTime)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="sessions")

class Organization(Base):
    __tablename__ = "Organization"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, index=True)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    members = relationship("OrganizationMember", back_populates="organization")
    repositories = relationship("Repository", back_populates="organization")

class OrganizationMember(Base):
    __tablename__ = "OrganizationMember"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    orgId = Column(Integer, ForeignKey("Organization.id"))
    userId = Column(Integer, ForeignKey("User.id"))
    role = Column(String, default="viewer") # "admin", "editor", "viewer"
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="members")
    user = relationship("User", back_populates="organizations")
