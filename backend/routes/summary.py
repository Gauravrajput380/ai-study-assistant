from fastapi import APIRouter
from pydantic import BaseModel
from database.db import get_connection
from services.ai_service import generate_short_summary, generate_detailed_summary, generate_summary_in_language

router = APIRouter()

class SummaryRequest(BaseModel):
    document_id: int
    summary_type: str

class MultiLangRequest(BaseModel):
    document_id: int
    summary_type: str
    language: str

@router.post("/summary")
async def get_summary(request: SummaryRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT content FROM documents WHERE id = ?", (request.document_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"summary": "Document not found"}

    text = row[0]

    if request.summary_type == "short":
        summary = generate_short_summary(text)
    else:
        summary = generate_detailed_summary(text)

    return {"summary": summary}

@router.post("/summary-language")
async def get_summary_language(request: MultiLangRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT content FROM documents WHERE id = ?", (request.document_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"summary": "Document not found"}

    text = row[0]
    summary = generate_summary_in_language(text, request.language, request.summary_type)
    return {"summary": summary}