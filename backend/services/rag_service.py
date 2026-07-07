from multiprocessing import context
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from services.qdrant_service import search_jobs, embed_all_jobs
from database import SessionLocal

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
)

rag_prompt = ChatPromptTemplate.from_messages([
    ("system","""You are a job search assistant.
Use the following job listings retrieved from the database to answer.
If no relevant jobs are found, say so clearly.
     
Retrieved Jobs:
{context}"""),
    ("human", "{question}"),
])

rag_chain = rag_prompt | llm


def rag_job_search(question: str) -> str:
    results = search_jobs(question, top_k=5)
    if not results:
        # Try to auto-embed jobs into Qdrant and retry the search
        try:
            with SessionLocal() as db:
                count = embed_all_jobs(db)
        except Exception:
            return "No relevant jobs found in the database. Please embed jobs first using the /rag/embed_jobs endpoint."

        if count > 0:
            results = search_jobs(question, top_k=5)

        if not results:
            return f"No relevant jobs found in the database. Embedded {count} jobs but none matched the query."
    context = "\n".join([
        f"- {r['title']}: {r['description']} (Salary: {r['salary']}, Match: {r['score']})"
        for r in results
    ])

    response = rag_chain.invoke({"context": context, "question": question})

    return response.content