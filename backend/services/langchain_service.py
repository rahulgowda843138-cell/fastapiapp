import os
import traceback
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv(override=True)

api_key = os.getenv("GROQ_API_KEY")

print("=" * 60)
print("DEBUG INFORMATION")
print("=" * 60)
print("API KEY FOUND:", bool(api_key))
print("=" * 60)

try:
    # pyrefly: ignore [missing-import]
    from langchain_groq import ChatGroq
    # pyrefly: ignore [missing-import]
    from langchain_core.prompts import (
        ChatPromptTemplate,
        MessagesPlaceholder,
    )
    # pyrefly: ignore [missing-import]
    from langchain_core.runnables.history import RunnableWithMessageHistory
    
    # pyrefly: ignore [missing-import]
    from langchain_community.chat_message_histories import ChatMessageHistory

    print("All LangChain imports successful.")

except Exception as e:
    print("Import Error:", e)
    traceback.print_exc()

    ChatGroq = None
    ChatPromptTemplate = None
    MessagesPlaceholder = None
    RunnableWithMessageHistory = None
    ChatMessageHistory = None

llm = None
chat_with_memory = None
store = {}

try:

    if not api_key:
        raise Exception("GROQ_API_KEY not found inside .env")

    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=api_key,
        temperature=0.5,
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
You are an AI Career Assistant.

Rules:
- Remember previous conversations.
- Use the conversation history while answering.
- Give clear and professional answers.
- If the user asks a follow-up question, answer using previous messages.
- If the user asks about themselves, use the stored conversation.
                """,
            ),

            MessagesPlaceholder(variable_name="history"),

            ("human", "{user_query}"),
        ]
    )

    chain = prompt | llm

    def get_history(session_id: str):
        if session_id not in store:
            store[session_id] = ChatMessageHistory()
        return store[session_id]

    chat_with_memory = RunnableWithMessageHistory(
        runnable=chain,
        get_session_history=get_history,
        input_messages_key="user_query",
        history_messages_key="history",
    )

    print("LangChain initialized successfully.")

except Exception:
    print("=" * 60)
    print("LANGCHAIN INITIALIZATION FAILED")
    print("=" * 60)
    traceback.print_exc()


def ask_career_chatbot_response(
    question: str,
    session_id: str = "default",
):

    if chat_with_memory is None:
        return (
            "Chat service is unavailable because "
            "the LangChain chat model could not be initialized."
        )

    try:

        response = chat_with_memory.invoke(
            {"user_query": question},
            config={
                "configurable": {
                    "session_id": session_id
                }
            },
        )

        if hasattr(response, "content"):
            return response.content

        return str(response)

    except Exception:
        traceback.print_exc()
        return "Error while generating AI response."