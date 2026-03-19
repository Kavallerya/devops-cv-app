import time
from prometheus_client import Counter, Histogram, CollectorRegistry, generate_latest, CONTENT_TYPE_LATEST
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

REGISTRY = CollectorRegistry(auto_describe=True)

REQUEST_COUNT = Counter(
    "cv_api_requests_total",
    "Total number of API requests",
    ["endpoint", "method", "status_code"],
    registry=REGISTRY,
)

REQUEST_DURATION = Histogram(
    "cv_api_request_duration_seconds",
    "API request duration in seconds",
    ["endpoint"],
    registry=REGISTRY,
)

VISITOR_COUNT = Counter(
    "cv_visitors_total",
    "Total number of unique CV visitors",
    registry=REGISTRY,
)


class PrometheusMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.perf_counter()
        response = await call_next(request)
        duration = time.perf_counter() - start_time

        endpoint = request.url.path
        method = request.method
        status_code = str(response.status_code)

        REQUEST_COUNT.labels(endpoint=endpoint, method=method, status_code=status_code).inc()
        REQUEST_DURATION.labels(endpoint=endpoint).observe(duration)

        return response


def get_metrics_output() -> bytes:
    return generate_latest(REGISTRY)


METRICS_CONTENT_TYPE = CONTENT_TYPE_LATEST
