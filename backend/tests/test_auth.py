from fastapi.testclient import TestClient

def test_register_user(client: TestClient):
    response = client.post(
        "/auth/register",
        json={
            "email": "testuser@example.com",
            "name": "Test User",
            "password": "testpassword123",
            "role": "student"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert "id" in data

def test_login_user(client: TestClient):
    # Register first
    client.post(
        "/auth/register",
        json={
            "email": "loginuser@example.com",
            "name": "Login User",
            "password": "loginpassword",
            "role": "student"
        }
    )
    # Login
    response = client.post(
        "/auth/login",
        data={
            "username": "loginuser@example.com",
            "password": "loginpassword"
        }
    )
    print("LOGIN RESPONSE:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "Bearer"
