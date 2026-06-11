from fastapi import APIRouter
from models.schemas import MCQRequest, MCQResponse
from database.db import get_connection
from services.ai_service import generate_mcqs, generate_mcqs_with_answers

router = APIRouter()

@router.post("/mcq", response_model=MCQResponse)
async def get_mcqs(request: MCQRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT content FROM documents WHERE id = ?", (request.document_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"mcqs": ["Document not found"]}

    text = row[0]
    mcqs = generate_mcqs(text)
    return {"mcqs": mcqs}

@router.post("/mcq-quiz")
async def get_mcq_quiz(request: MCQRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT content FROM documents WHERE id = ?", (request.document_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"questions": []}

    text = row[0]
    questions = generate_mcqs_with_answers(text)
    return {"questions": questions}