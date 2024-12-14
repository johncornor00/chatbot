
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from models.usermodel import User
from argon2 import PasswordHasher
from uuid import uuid4
# from database import db 
from middleware.authuser import get_current_user, admin_only
import logging

router = APIRouter()
ph = PasswordHasher()

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    confPassword: str 
    role: str  
class UserUpdate(BaseModel):
    name: str
    email: str
    password: str = None 
    confPassword: str = None 
    role: str

class UserResponse(BaseModel):
    uuid: str
    name: str
    email: str
    role: str


def user_helper(user) -> dict:
    return {
        "uuid": user["uuid"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"]
    }

@router.get("/users", response_model=List[UserResponse])
async def getUsers():
    users = User.get_all_users()
    return users

@router.get("/users/{id}", response_model=UserResponse)
async def getUserById(id: str):
    user = User.get_user_by_id(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users", response_model=UserResponse)
async def createUser(user: UserCreate):
    if user.password != user.confPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    hashPassword = ph.hash(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashPassword,
        "role": user.role,
    }
    created_user = User.create_user(new_user)
    return user_helper(created_user)

@router.patch("/users/{id}", response_model=UserResponse)
async def updateUser(id: str, user: UserUpdate):
    existing_user = User.find_user_by_uuid(id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    update_data = user.dict(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        if update_data["password"] != user.confPassword:
            raise HTTPException(status_code=400, detail="Passwords do not match")
        update_data["password"] = ph.hash(update_data["password"])
    if not User.update_user(id, update_data):
        raise HTTPException(status_code=400, detail="User update failed")
    updated_user = User.find_user_by_uuid(id)
    return user_helper(updated_user)

# @router.delete("/users/{id}")
# async def deleteUser(id: str):
#     logging.info(f"Attempting to delete user with uuid: {id}")
#     if not User.delete_user(id):
#         raise HTTPException(status_code=404, detail="User not found or already deleted")
#     logging.info(f"User with uuid: {id} deleted successfully")
#     return {"message": "User deleted successfully"}


@router.delete("/users/{id}")
async def deleteUser(id: str):
    logging.info(f"Attempting to delete user with uuid: {id}")
    result = User.delete_user(id)
    if not result:
        logging.debug(f"Failed to delete user with uuid: {id}. Result from delete_user: {result}")
        raise HTTPException(status_code=404, detail="User not found or already deleted")
    logging.info(f"User with uuid: {id} deleted successfully")
    return {"message": "User deleted successfully"}