

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from typing import Optional
from models.usermodel import User
from dotenv import load_dotenv
import os
import logging

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TokenData(BaseModel):
    uuid: Optional[str] = None

class UserResponseModel(BaseModel):
    uuid: str
    name: str
    email: str
    role: str

async def verify_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        logger.info(f"Decoding token")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uuid: str = payload.get("sub")
        if uuid is None:
            logger.error("UUID not found in token payload")
            raise credentials_exception
        token_data = TokenData(uuid=uuid)
    except JWTError as e:
        logger.error(f"JWT error: {e}")
        raise credentials_exception
    user = User.find_user_by_uuid(token_data.uuid)
    if user is None:
        logger.error(f"User not found for UUID: {token_data.uuid}")
        raise credentials_exception
    logger.info(f"User verified:")
    return user

async def get_current_user(current_user: dict = Depends(verify_user)):
    return UserResponseModel(
        uuid=current_user["uuid"],
        name=current_user["name"],
        email=current_user["email"],
        role=current_user["role"],
    )


async def admin_only(current_user: UserResponseModel = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access prohibited")
    return current_user




