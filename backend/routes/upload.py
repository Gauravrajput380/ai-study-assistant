from fastapi import APIRouter, UploadFile, File
import shutil
import os
from services.file_parser import extract_text_from_file
from database.db import get_connection

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    text = extract_text_from_file(file_path, file.filename)
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO documents (filename, content) VALUES (?, ?)",
        (file.filename, text)
    )
    conn.commit()
    doc_id = cursor.lastrowid
    conn.close()
    
    return {"id": doc_id, "filename": file.filename, "message": "File uploaded successfully"}