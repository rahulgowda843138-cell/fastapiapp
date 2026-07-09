# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, Body
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from database import get_db

from schemas.rag import (
    ResumeRequest,
    ResumeResponse,
    JobMatchRequest,
    RagSearchRequest,
    RagSearchResponse,
    EmbedResponse,
    JobSearchRequest,
    SemanticSearchResponse,
    SemanticSearchResult,
)

from services.resume_service import analyse_resume
from services.qdrant_service import (
    embed_all_jobs,
    search_jobs,
)
from services.rag_service import rag_job_search

router = APIRouter(
    prefix="/rag",
    tags=["RAG"],
)


# --------------------------------------------------
# Embed Jobs into Qdrant
# --------------------------------------------------

@router.post("/embed-jobs", response_model=EmbedResponse)
def embed_jobs(db: Session = Depends(get_db)):
    count = embed_all_jobs(db)

    return EmbedResponse(
        message=f"Embedded {count} jobs into Qdrant",
        count=count,
    )


# --------------------------------------------------
# Semantic Search
# --------------------------------------------------

@router.post("/search", response_model=SemanticSearchResponse)
def semantic_search(request: JobSearchRequest):

    results = search_jobs(
        request.query,
        top_k=5,
    )

    return SemanticSearchResponse(
        results=[
            SemanticSearchResult(**r)
            for r in results
        ]
    )


# --------------------------------------------------
# RAG Chat
# --------------------------------------------------

@router.post("/ask", response_model=RagSearchResponse)
def rag_ask(request: RagSearchRequest):

    answer = rag_job_search(
        request.question
    )

    return RagSearchResponse(
        answer=answer
    )


# --------------------------------------------------
# Resume Analysis
# --------------------------------------------------

@router.post(
    "/analyse-resume",
    response_model=ResumeResponse,
)
def resume_analyse(request: ResumeRequest):

    analysis = analyse_resume(
        request.resume_text
    )

    return ResumeResponse(
        analysis=analysis
    )


# --------------------------------------------------
# Resume Analysis (Plain Text)
# --------------------------------------------------

@router.post(
    "/analyse-resume/text",
    response_model=ResumeResponse,
)
def resume_analyse_text(
    body: str = Body(..., media_type="text/plain")
):

    analysis = analyse_resume(body)

    return ResumeResponse(
        analysis=analysis
    )


# --------------------------------------------------
# AI Resume vs Job Description Match
# --------------------------------------------------

@router.post("/job-match")
def job_match(request: JobMatchRequest):

    from services.rag_service import ai_job_match
    
    result = ai_job_match(request.resume_text, request.job_description)
    
    score = result.get("match_score", 0)
    
    if score >= 80:
        recommendation = "Excellent Match"
    elif score >= 60:
        recommendation = "Good Match"
    elif score >= 40:
        recommendation = "Average Match"
    else:
        recommendation = "Poor Match"

    return {
        "match_score": score,
        "matched_skills": result.get("matched_skills", []),
        "missing_skills": result.get("missing_skills", []),
        "recommendation": recommendation,
    }
