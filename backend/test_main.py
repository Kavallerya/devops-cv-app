from fastapi.testclient import TestClient
# Вказуємо правильний шлях: папка app, файл main
from app.main import app 

client = TestClient(app)

def test_api_profile_exists():
    """Перевіряємо, що головний ендпоінт бекенду відповідає."""
    response = client.get("/api/profile")
    assert response.status_code in [200, 401, 403, 404] 
    
def test_metrics_endpoint():
    """Перевіряємо, що метрики для Графани доступні"""
    response = client.get("/api/metrics")
    assert response.status_code == 200
    assert "cv_api_requests_total" in response.text