from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

class UserCreate(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ChatMessage(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

class AIReviewRequest(BaseModel):
    code: str

class RepoCreate(BaseModel):
    url: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = None

    class Config:
        orm_mode = True

class OrganizationCreate(BaseModel):
    name: str

class OrganizationResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class OrganizationMemberResponse(BaseModel):
    id: int
    orgId: int
    userId: int
    role: str
    user: Optional[UserResponse] = None

    class Config:
        orm_mode = True
