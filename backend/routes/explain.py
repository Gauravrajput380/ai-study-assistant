from fastapi import APIRouter
from models.schemas import ExplainRequest, ExplainResponse
from services.ai_service import explain_topic

router = APIRouter()

@router.post("/explain", response_model=ExplainResponse)
async def get_explanation(request: ExplainRequest):
    explanation = explain_topic(request.topic)
    return {"explanation": explanation}