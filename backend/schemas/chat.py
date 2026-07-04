from typing import Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    session_id: str
    user_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
