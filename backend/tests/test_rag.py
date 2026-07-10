from fastapi.testclient import TestClient
from unittest.mock import patch

def test_embed_jobs(client: TestClient):
    with patch("routers.rag.embed_all_jobs", return_value=5):
        response = client.post("/rag/embed-jobs")
        assert response.status_code == 200
        assert response.json()["count"] == 5

def test_semantic_search(client: TestClient):
    mock_results = [{"job_id": 1, "score": 0.95, "title": "Mock Job", "description": "Desc"}]
    with patch("routers.rag.search_jobs", return_value=mock_results):
        response = client.post(
            "/rag/search",
            json={"query": "python developer"}
        )
        assert response.status_code == 200
        assert len(response.json()["results"]) == 1
        assert response.json()["results"][0]["title"] == "Mock Job"

def test_rag_ask(client: TestClient):
    with patch("routers.rag.rag_job_search", return_value="Here is your job info"):
        response = client.post(
            "/rag/ask",
            json={"question": "What jobs are there?"}
        )
        assert response.status_code == 200
        assert response.json()["answer"] == "Here is your job info"

def test_resume_analyse(client: TestClient):
    mock_analysis = "Python, C++"
    with patch("routers.rag.analyse_resume", return_value=mock_analysis):
        response = client.post(
            "/rag/analyse-resume",
            json={"resume_text": "I know Python and C++."}
        )
        assert response.status_code == 200
        assert response.json()["analysis"] == mock_analysis

def test_job_match(client: TestClient):
    mock_match = {"match_score": 85, "matched_skills": ["Python"], "missing_skills": []}
    with patch("services.rag_service.ai_job_match", return_value=mock_match):
        response = client.post(
            "/rag/job-match",
            json={"resume_text": "Python dev", "job_description": "Need Python dev"}
        )
        assert response.status_code == 200
        assert response.json()["match_score"] == 85
        assert response.json()["recommendation"] == "Excellent Match"
