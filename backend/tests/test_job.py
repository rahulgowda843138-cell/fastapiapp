from fastapi.testclient import TestClient
from datetime import datetime, timedelta

def get_auth_token(client: TestClient):
    # Use distinct user for job tests to avoid conflict if tests run in parallel
    client.post(
        "/auth/register",
        json={
            "email": "jobuser@example.com",
            "name": "Job User",
            "password": "jobpassword",
            "role": "recruiter"
        }
    )
    response = client.post(
        "/auth/login",
        data={
            "username": "jobuser@example.com",
            "password": "jobpassword"
        }
    )
    return response.json()["access_token"]

def test_create_and_get_job(client: TestClient):
    token = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Company first
    company_resp = client.post(
        "/company/",
        headers=headers,
        json={
            "name": "Job Corp",
            "description": "A job company",
            "website": "https://jobcorp.example.com",
            "location": "New York, NY"
        }
    )
    company_id = company_resp.json()["id"]

    # Create Job
    future_date = (datetime.now() + timedelta(days=30)).isoformat()
    job_resp = client.post(
        "/job/",
        headers=headers,
        json={
            "title": "Software Engineer",
            "description": "Develop cool things",
            "requirements": ["Python", "FastAPI"],
            "salary": 120000.0,
            "location": "Remote",
            "job_type": "Full-time",
            "experience_level": "Mid",
            "company_id": company_id,
            "position": 5,
            "application_deadline": future_date
        }
    )
    assert job_resp.status_code == 201
    data = job_resp.json()
    assert data["title"] == "Software Engineer"
    
    # Get all jobs
    list_resp = client.get("/job/")
    assert list_resp.status_code == 200
    assert len(list_resp.json()) > 0
