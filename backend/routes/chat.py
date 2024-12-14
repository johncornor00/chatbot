
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from pymongo import MongoClient
import openai
import os
from uuid import uuid4
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI is not set. Please set it in the .env file.")

client = MongoClient(MONGO_URI)
db = client.Chat_DB
conversations_collection = db.conversations

router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str
    uuid: str
    conversation_id: Optional[str] = None

@router.post("/chat")
async def chat_with_openai(request: ChatRequest):
    if not request.uuid:
        raise HTTPException(status_code=400, detail="UUID is required.")
    
    try:
        conversation_id = request.conversation_id or str(uuid4())
        conversation = conversations_collection.find_one({"conversation_id": conversation_id, "uuid": request.uuid})
        if not conversation:
            conversation = {
                "conversation_id": conversation_id,
                "uuid": request.uuid,
                "history": [],
            }
            conversations_collection.insert_one(conversation)

        user_message = {"role": "user", "content": request.prompt}
        conversation["history"].append(user_message)

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=conversation["history"],
            max_tokens=2048,
            temperature=0.75,
        )
        assistant_message = {"role": "assistant", "content": response.choices[0].message["content"]}
        conversation["history"].append(assistant_message)

        conversations_collection.update_one(
            {"conversation_id": conversation_id},
            {"$set": {"history": conversation["history"]}}
        )

        return {
            "response": assistant_message["content"],
            "conversation_id": conversation_id,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/history/{uuid}")
async def get_chat_history(uuid: str):
    try:
        if not uuid:
            raise HTTPException(status_code=400, detail="UUID is required.")
        
        conversations = conversations_collection.find({"uuid": uuid})
        chat_history = [
            {"conversation_id": convo["conversation_id"], "history": convo["history"]}
            for convo in conversations
        ]
        return {"chat_history": chat_history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chat history: {str(e)}")
