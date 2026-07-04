import os

from dotenv import load_dotenv

try:
    from langchain_groq import ChatGroq
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.runnables import RunnableWithMessageHistory
    from langchain_community.chat_message_histories import ChatMessageHistory
except ImportError:
    ChatGroq = None
    ChatPromptTemplate = None
    RunnableWithMessageHistory = None
    ChatMessageHistory = None

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
llm = None
prompt_with_memory = None
chain_with_memory = None
chat_with_memory = None
store = {}

if ChatGroq is not None and ChatPromptTemplate is not None and RunnableWithMessageHistory is not None and ChatMessageHistory is not None and api_key:
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=api_key,
        temperature=0.5,
    )

    prompt_with_memory = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a helpful AI assistant. Answer clearly and accurately.",
            ),
            ("placeholder", "{chathistory}"),
            ("human", "{user_query}"),
        ]
    )

    chain_with_memory = prompt_with_memory | llm

    def get_history(session_id: str):
        if session_id not in store:
            store[session_id] = ChatMessageHistory()
        return store[session_id]

    chat_with_memory = RunnableWithMessageHistory(
        runnable=chain_with_memory,
        get_session_history=get_history,
        input_messages_key="user_query",
        history_messages_key="chathistory",
    )


def ask_career_chatbot_question(question: str, session_id: str = "default") -> str:
    if chat_with_memory is None:
        if not api_key:
            return "Chat service is unavailable because GROQ_API_KEY is not configured."
        return "Chat service is unavailable because the LangChain chat model could not be initialized."

    try:
        response = chat_with_memory.invoke(
            {"user_query": question},
            {"configurable": {"session_id": session_id}},
        )
    except ValueError:
        if chain_with_memory is not None:
            response = chain_with_memory.invoke({"user_query": question})
        else:
            response = chat_with_memory.invoke({"user_query": question})

    return response.content if hasattr(response, "content") else str(response)


def ask_career_chatbot_response(question: str, session_id: str = "default") -> str:
    return ask_career_chatbot_question(question, session_id)