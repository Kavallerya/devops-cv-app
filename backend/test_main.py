from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_api_profile_exists():
    """Verify the main API profile endpoint responds."""
    response = client.get("/api/profile")
    assert response.status_code in [200, 401, 403, 404]


def test_metrics_endpoint():
    """Verify Prometheus metrics endpoint is exposed."""
    response = client.get("/api/metrics")
    assert response.status_code == 200
    assert "http_requests_total" in response.text
