from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from .Handlers import query_PDF
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
    
    datum = query_PDF.get_all_titles()
    title = []
    id = []
    namespace = {}
    if (datum != None):
        for item in datum:
            if (len(item)>3):
                id.append(item[0])
                title.append(item[1])
                namespace[item[0]]=item[3]
            id.append(item[0])
            title.append(item[1])
        return {'title':title, 'id': id, 'namespace': namespace}
            
    else:
        return {'error': 'data not found'}




# API for collecting chat history
# requires chat ID
@app.get("/{id}")
def get_history_data(id:str):
    data = query_PDF.get_history(id)
    if(data != None):
        return {'data': data}
    else:
        return {'error': 'data not found'}


# API endpoint for asking question
# requires a JSON object in string format as input
# {"id": "<chatid>",
# "qn": "<yourquestion>"}
@app.post("/chatbot/question/{id}/{qn}/{namespace}")
def query_llm(id:str, qn:str, namespace:str):
    if (namespace == "knowledgebase^consolidated"):
        namespace = namespace.replace('~','_')
    else:
        namespace = namespace.replace("~","_")

    ans = query_PDF.query_pdf(id , qn, namespace)
    if(ans != None):
        return { 'data': ans}
    else:
        return {'error': 'data not found'}

# API for creating new chat without pdf
# requires question in string
@app.post("/chatbot/{qn}")
def create_new_chat(qn:str):
    id,title,question,answer = query_PDF.query_pdf_new(qn)
    if(id,title,question,answer != None):
        return{'id':id, 'title': title, 'question': question, 'answer': answer}
    else:
        return {'error': 'data not found'}


# API for creating new chat with pdf
# requires question in string
@app.post("/chatbot/{qn}/{namespace}")
def create_new_chat(qn:str, namespace:str):
    id,title,question,answer = query_PDF.query_pdf_new(qn, namespace)
    if(id,title,question,answer != None):
        return{'id':id, 'title': title, 'question': question, 'answer': answer}
    else:
        return {'error': 'data not found'}
    
# API for receving pdf and creating vectorstore
@app.post("/upload/{id}/{fpath}")
def upload(id:str, fpath:str):
    namespace = query_PDF.vectorise_pdf(id, fpath)
    status = query_PDF.add_history_upload_pdf(id)
    
    return {'status':status,'namespace': namespace}