from fastapi import FastAPI
from app.Handlers import query
# from pydantic import BaseModel
import os



app = FastAPI()


@app.post("/")
def query_llm(question):
    qid = "test"
    ans = query.ask_question(qid , question)
    return { 'data': ans}

