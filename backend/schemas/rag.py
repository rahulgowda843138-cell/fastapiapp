from pydantic import BaseModel
from typing import Optional


# -------------------------------------------------
# Resume Analysis
# -------------------------------------------------

class ResumeRequest(BaseModel):
    resume_text: str


class ResumeResponse(BaseModel):
    analysis: str


# -------------------------------------------------
# Semantic Search
# -------------------------------------------------

class JobSearchRequest(BaseModel):
    query: str


# -------------------------------------------------
# Job Match
# -------------------------------------------------

class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str


class JobMatchResult(BaseModel):
    job_id: Optional[int] = None
    title: str
    description: str
    salary: Optional[int] = None
    match_score: float


class JobMatchResponse(BaseModel):
    matches: list[JobMatchResult]


# -------------------------------------------------
# RAG Chat
# -------------------------------------------------

class RagSearchRequest(BaseModel):
    question: str


class RagSearchResponse(BaseModel):
    answer: str


# -------------------------------------------------
# Embed Jobs
# -------------------------------------------------

class EmbedResponse(BaseModel):
    message: str
    count: int


# -------------------------------------------------
# Semantic Search Response
# -------------------------------------------------

class SemanticSearchResult(BaseModel):
    job_id: Optional[int] = None
    title: str
    description: str
    salary: Optional[int] = None
    score: float


class SemanticSearchResponse(BaseModel):
    results: list[SemanticSearchResult]