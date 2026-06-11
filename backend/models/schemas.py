from pydantic import BaseModel

class DocumentResponse(BaseModel):
    id: int
    filename: str
    message: str

class SummaryRequest(BaseModel):
    document_id: int
    summary_type: str  # "short" or "detailed"

class SummaryResponse(BaseModel):
    summary: str

class QuestionRequest(BaseModel):
    document_id: int

class QuestionResponse(BaseModel):
    questions: list

class MCQRequest(BaseModel):
    document_id: int

class MCQResponse(BaseModel):
    mcqs: list

class ExplainRequest(BaseModel):
    topic: str

class ExplainResponse(BaseModel):
    explanation: str