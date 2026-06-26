# backend/test_main.py
from fastapi.testclient import TestClient
# Якщо твій головний файл називається app.py, зміни 'main' на 'app'
from main import app 

client = TestClient(app)

def test_api_profile_exists():
    """
    Перевіряємо, що головний ендпоінт бекенду відповідає (не падає з 500 помилкою).
    Заміни '/api/profile' на свій реальний ендпоінт, якщо він інший.
    """
    response = client.get("/api/profile")
    # Перевіряємо, що статус код не серверна помилка
    assert response.status_code in [200, 401, 403, 404] 
    
def test_metrics_endpoint():
    """Перевіряємо, що метрики для Графани доступні"""
    response = client.get("/api/metrics")
    assert response.status_code == 200
    assert "cv_api_requests_total" in response.text