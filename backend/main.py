from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import init_db
from routes import upload, summary, questions, mcq, explain

app = FastAPI(title="AI Study Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(upload.router)
app.include_router(summary.router)
app.include_router(questions.router)
app.include_router(mcq.router)
app.include_router(explain.router)

@app.get("/")
def root():
    return {"message": "AI Study Assistant API is running"}