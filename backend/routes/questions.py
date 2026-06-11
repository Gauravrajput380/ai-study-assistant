from fastapi import APIRouter
from models.schemas import QuestionRequest, QuestionResponse
from database.db import get_connection
from services.ai_service import generate_questions

router = APIRouter()

@router.post("/questions", response_model=QuestionResponse)
async def get_questions(request: QuestionRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT content FROM documents WHERE id = ?", (request.document_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"questions": ["Document not found"]}

    text = row[0]
    questions = generate_questions(text)

    return {"questions": questions}