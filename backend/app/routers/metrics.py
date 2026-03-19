from fastapi import APIRouter
from fastapi.responses import Response
from app.metrics import get_metrics_output, METRICS_CONTENT_TYPE

router = APIRouter()


@router.get("/metrics")
async def metrics():
    return Response(
        content=get_metrics_output(),
        media_type=METRICS_CONTENT_TYPE,
    )
