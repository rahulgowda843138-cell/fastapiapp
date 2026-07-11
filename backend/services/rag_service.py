from multiprocessing import context
import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
from langchain_groq import ChatGroq
# pyrefly: ignore [missing-import]
from langchain_core.prompts import ChatPromptTemplate
from services.qdrant_service import search_jobs, embed_all_jobs
# pyrefly: ignore [missing-import]
from database import SessionLocal

load_dotenv(override=True)

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

    try:
        response = rag_chain.invoke({"context": context, "question": question})
        return response.content
    except Exception as e:
        print(f"RAG Chat Error: {e}")
        return "Sorry! Unable to answer your question at this time. Please check your AI configuration."

import json

job_match_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert technical recruiter and AI matching engine.
Your task is to analyze a Job Description and a candidate's Resume.
1. Extract the core skills (technical, soft, tools, domain knowledge) required by the Job Description.
2. Extract the skills present in the Resume.
3. Compare them and categorize the Job's required skills into 'matched_skills' (found in resume) and 'missing_skills' (not found).
4. Calculate a 'match_score' from 0 to 100 based on the percentage of required skills met, giving more weight to crucial technical skills.
5. Return the result strictly as a JSON object with this exact structure:
{{
  "match_score": 85,
  "matched_skills": ["Python", "AWS", "Communication"],
  "missing_skills": ["Docker", "Kubernetes"]
}}
Do NOT output any markdown, text, or formatting outside of the JSON object.
"""),
    ("human", "Resume:\n{resume}\n\nJob Description:\n{job}")
])

job_match_chain = job_match_prompt | llm

def ai_job_match(resume_text: str, job_description: str) -> dict:
    try:
        response = job_match_chain.invoke({
            "resume": resume_text,
            "job": job_description
        })
        content = response.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
        
        return json.loads(content)
    except Exception as e:
        print("AI Job Match Error:", e)
        # Fallback to naive if LLM fails
        import re
        def extract_keywords(text):
            words = set(re.findall(r'\b[a-zA-Z]{3,}\b', text.lower()))
            stop_words = {'and', 'the', 'for', 'with', 'you', 'are', 'this', 'that', 'will', 'have', 'your', 'our', 'from'}
            return words - stop_words
            
        resume_words = extract_keywords(resume_text)
        job_words = extract_keywords(job_description)
        matched = sorted(list(resume_words & job_words))
        missing = sorted(list(job_words - resume_words))
        score = round((len(matched) / len(job_words)) * 100, 2) if job_words else 0
        return {
            "match_score": score,
            "matched_skills": matched,
            "missing_skills": missing
        }