from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv
import os
import logging
from routes.authroute import router as auth_router
from routes.userroute import router as user_router
from routes.chat import router as chat_router



load_dotenv()

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("azure")
logger.setLevel(logging.WARNING)

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"Allowed CORS Origins: {origins}")

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(chat_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Chat API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.on_event("startup")
async def startup_event():
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OpenAI API key not found. Please set it in the .env file.")
    else:
        print(f"OpenAI API Key: {openai_api_key[:5]}...")  
    port = os.getenv("APP_PORT", 8000)
    print(f"Server up and running on port {port}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("APP_PORT", 8000)),
        log_level="debug",
        reload=True
    )
