from fastapi import FastAPI
from app.Handlers import query
import os



app = FastAPI()
@app.get("/")
async def root():
    ans = query.ask_question("test" , "who is trump")
    return { 'data':ans}