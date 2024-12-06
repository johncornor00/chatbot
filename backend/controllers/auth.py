import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
from middleware.authuser import get_current_user, oauth2_scheme
from models.usermodel import User
from argon2 import PasswordHasher
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120
REFRESH_TOKEN_EXPIRE_DAYS = 7

ph = PasswordHasher()

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str  

class TokenData(BaseModel):
    uuid: Optional[str] = None

class UserResponseModel(BaseModel):
    uuid: str
    name: str
    email: str
    role: str


router = APIRouter()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = User.find_user_by_email(form_data.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    try:
        ph.verify(user["password"], form_data.password)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user["uuid"]})
    refresh_token = create_refresh_token(data={"sub": user["uuid"]})
    user['refresh_token'] = refresh_token
    User.update_user(user['id'], user)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "uuid": user["uuid"],
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(payload: dict):
    refresh_token = payload.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Refresh token missing")
    try:
        decoded_payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if decoded_payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        new_access_token = create_access_token({"sub": decoded_payload["sub"]})
        new_refresh_token = create_refresh_token({"sub": decoded_payload["sub"]})
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "uuid": uuid,
            "token_type": "bearer"
        }
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

@router.get("/me", response_model=UserResponseModel)
async def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.delete("/logout")
async def logout(current_user: UserResponseModel = Depends(get_current_user)):
    user = User.find_user_by_uuid(current_user.uuid)
    if user:
        user['refresh_token'] = None  
        User.update_user(user['id'], user)  
    return {"message": "Logout successful"}

