from fastapi.testclient import TestClient

def get_auth_token(client: TestClient):
    client.post(
        "/auth/register",
        json={
            "email": "companyuser@example.com",
            "name": "Company User",
            "password": "companypassword",
            "role": "recruiter"
        }
    )
    response = client.post(
        "/auth/login",
        data={
            "username": "companyuser@example.com",
            "password": "companypassword"
        }
    )
    return response.json()["access_token"]

def test_create_and_get_company(client: TestClient):
    token = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Company
    response = client.post(
        "/company/",
        headers=headers,
        json={
            "name": "Tech Corp",
            "email": "contact@techcorp.example.com",
            "phone": "+1234567890",
            "location": "San Francisco, CA"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Tech Corp"
    company_id = data["id"]
    
    # Get Company
    get_resp = client.get(f"/company/{company_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Tech Corp"
