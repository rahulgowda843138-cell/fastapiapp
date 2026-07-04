import unittest
from unittest.mock import patch

from schemas.chat import ChatRequest
from services import langchain_service


class ChatRequestTests(unittest.TestCase):
    def test_accepts_frontend_chat_payload(self):
        payload = {"message": "Hello", "session_id": "abc123"}
        request = ChatRequest(**payload)

        self.assertEqual(request.message, "Hello")
        self.assertEqual(request.session_id, "abc123")

    def test_falls_back_without_session_config(self):
        class FakeResponse:
            content = "fallback response"

        class FakeHistoryRunnable:
            def invoke(self, payload, config=None):
                raise ValueError("Missing keys ['session_id'] in config['configurable']")

        class FakeChain:
            def __init__(self):
                self.received = None

            def invoke(self, payload):
                self.received = payload
                return FakeResponse()

        fake_chain = FakeChain()

        with patch.object(langchain_service, "chat_with_memory", FakeHistoryRunnable()), patch.object(langchain_service, "chain_with_memory", fake_chain):
            response = langchain_service.ask_career_chatbot_question("Hello")

        self.assertEqual(response, "fallback response")
        self.assertEqual(fake_chain.received, {"user_query": "Hello"})


if __name__ == "__main__":
    unittest.main()
