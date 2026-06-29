import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def call_ai(prompt: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

def generate_short_summary(text: str) -> str:
    prompt = f"Summarize the following study material in 100-150 words:\n\n{text}"
    return call_ai(prompt)

def generate_detailed_summary(text: str) -> str:
    prompt = f"Summarize the following study material in 300-500 words with key concepts:\n\n{text}"
    return call_ai(prompt)

def generate_questions(text: str) -> list:
    prompt = f"Generate 10 important exam questions from this study material. Return them as a numbered list:\n\n{text}"
    result = call_ai(prompt)
    return result.strip().split("\n")

def generate_mcqs(text: str) -> list:
    prompt = f"""Generate 10 multiple choice questions from this study material.
Format each question exactly like this:
Q: question here
A. option1
B. option2
C. option3
D. option4
Answer: X

Study material:
{text}"""
    result = call_ai(prompt)
    return result.strip().split("\n\n")

def explain_topic(topic: str) -> str:
    prompt = f"Explain the topic '{topic}' in simple, student-friendly language in 200-300 words."
    return call_ai(prompt)

def generate_mcqs_with_answers(text: str) -> list:
    prompt = f"""Generate exactly 10 multiple choice questions from this study material.
You MUST return ONLY a valid JSON array. No explanation, no markdown, no extra text.
Format:
[
  {{
    "question": "What is X?",
    "options": {{"A": "option1", "B": "option2", "C": "option3", "D": "option4"}},
    "answer": "A",
    "explanation": "This is correct because..."
  }}
]
Study material:
{text}"""
    result = call_ai(prompt)
    import json
    try:
        clean = result.strip()
        start = clean.find('[')
        end = clean.rfind(']') + 1
        if start != -1 and end != 0:
            clean = clean[start:end]
        return json.loads(clean)
    except:
        return []

def generate_summary_in_language(text: str, language: str, summary_type: str) -> str:
    if summary_type == "short":
        word_count = "100-150 words"
    else:
        word_count = "300-500 words"

    prompt = f"""Summarize the following study material in {word_count}.
Reply in {language} language only.

Study material:
{text}"""
    return call_ai(prompt)