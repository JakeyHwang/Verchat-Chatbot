from fastapi import FastAPI, Header
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from .Handlers import query
# from pydantic import BaseModel
import os
import json



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
# API for collecting all chat titles upon logging in
@app.get("/")
def start_up():
    datum = query.get_all_titles()
    title = []
    id = []
    if (datum != None):
        for data in datum:
            title.append(data[1])
            id.append(data[0])
        
        return {'title':title, 'id': id}
    else:
        return {'error': 'data not found'}




# API for collecting chat history
# requires chat ID
@app.get("/{id}")
def get_history_data(id:str):
    data = query.get_history(id)
    if(data != None):
        return {'data': data}
    else:
        return {'error': 'data not found'}


# API endpoint for asking question
# requires a JSON object in string format as input
# {"id": "<chatid>",
# "qn": "<yourquestion>"}
@app.post("/chatbot/question/{data}")
def query_llm(data:str):
    data = json.loads(data)
    if (data!=None):
        id = data['id']
        qn = data['qn']
        ans = query.ask_question(id , qn)
        return { 'data': ans}
    else:
        return {'error': 'data not found'}

# API for creating new chat
# requires question in string
@app.post("/chatbot/{qn}")
def create_new_chat(qn:str):
    id,title,question,answer = query.ask_new_question(qn)
    if(id,title,question,answer != None):
        return{'id':id, 'title': title, 'question': question, 'answer': answer}
    else:
        return {'error': 'data not found'}

{"id": "mCwXP0RwWY3yqsGKgtR2",
 "qn": "How long has this company been around"}