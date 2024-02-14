from fastapi import FastAPI
from Handlers import query
# from pydantic import BaseModel
import os
import json



app = FastAPI()

# API for collecting all chat titles upon logging in
@app.get("/")
def start_up():
    titles = query.get_all_titles()
    return {'titles':titles}



# API for collecting chat history
# requires chat ID
@app.post("/{id}")
def get_history_data(id:str):
    data = query.get_history(id)
    return {'data': data}

# API endpoint for asking question
# requires a JSON object in string format as input
# {"id": "<chatid>",
# "qn": "<yourquestion>"}
@app.post("/chatbot/question/{data}")
def query_llm(data:str):
    data = json.loads(data)
    id = data['id']
    qn = data['qn']
    ans = query.ask_question(id , qn)
    return { 'data': ans}

# API for creating new chat
# requires question in string
@app.post("/chatbot/{qn}")
def create_new_chat(qn:str):
    
    id,title,question,answer = query.ask_new_question(qn)
    return{'id':id, 'title': title, 'question': question, 'answer': answer}
    

{"id": "fJdpBSpUWUro240vRfX1",
 "qn": "What is the estimate of his net worth? Be thorough."}