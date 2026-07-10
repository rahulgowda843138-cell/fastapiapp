from fastapi.testclient import TestClient
from unittest.mock import patch
from services import langchain_service

def test_ask_career_chatbot(client: TestClient):
    with patch("routers.chat.ask_career_chatbot_response", return_value="Mocked AI Response"):
        response = client.post(
            "/chat/",
            json={
                "message": "How do I become a software engineer?",
                "session_id": "test_session_123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["response"] == "Mocked AI Response"
