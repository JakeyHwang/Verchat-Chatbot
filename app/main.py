from fastapi import FastAPI
from app.Handlers import query
# from pydantic import BaseModel
import os



app = FastAPI()


@app.get("/")
def query_llm():
    qid = "test"
    ans = query.ask_question(qid , "Who is Lee Kuan yew" )
    return { 'data': ans}

