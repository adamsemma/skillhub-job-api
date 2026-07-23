from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_search_compatibility_route_returns_frontend_shape(monkeypatch):
    async def fake_search_jobs(request):
        return []

    monkeypatch.setattr(
        "app.api.endpoints.search.search_service.search_jobs",
        fake_search_jobs,
    )

    response = client.post(
        "/api/search",
        json={"query": "python", "max_results": 2, "include_answer": False},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["query"] == "python"
    assert payload["results"] == []
    assert payload["mock"] is False


def test_dashboard_jobs_compatibility_route_returns_frontend_shape(monkeypatch):
    async def fake_search_jobs(request):
        return []

    monkeypatch.setattr(
        "app.api.endpoints.search.search_service.search_jobs",
        fake_search_jobs,
    )

    response = client.get(
        "/api/dashboard/jobs",
        params={"query": "python", "max_results": 2},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["query"] == "python"
    assert payload["results"] == []
    assert payload["jobs"] == []


def test_login_compatibility_route_accepts_valid_credentials():
    response = client.post(
        "/api/auth/login",
        json={"email": "user@example.com", "password": "secret123"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["token"]
    assert payload["user"]["email"] == "user@example.com"
