import langchain
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.messages import AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder , PromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.prompts import PromptTemplate
import firebase_admin
from firebase_admin import credentials , firestore
from google.cloud.firestore import ArrayUnion
from dotenv import load_dotenv
import os
from datetime import datetime
import pytz

load_dotenv()

os.environ["OPENAI_API_KEY"] = os.getenv("openai_api_key")

def get_all_titles():#Provides all Titles and ID
    try:
        cred = credentials.Certificate("./firebase_keys.json")
        app = firebase_admin.initialize_app(cred)
        db = firestore.client()
        documents_data = []
        collection_name = "Verchat"
        collection_ref = db.collection(collection_name)
        docs = collection_ref.stream()
        for doc in docs:
            doc_id = doc.id
            doc = doc.to_dict()
            documents_data.append((doc_id , doc['title'] , doc['edited']))#New

        sorted_data = sorted(documents_data, key=lambda x: x[2])#New
        firebase_admin.delete_app(app)#New
        return sorted_data
    except Exception as E:
        print(E)
        firebase_admin.delete_app(app)
        return []
    




def put_history(id,human,ai):
    try :
        cred = credentials.Certificate("./firebase_keys.json")
        app = firebase_admin.initialize_app(cred)
        db = firestore.client()
        doc_ref = db.collection("Verchat").document(id)
        doc = doc_ref.get()
        doc = doc.to_dict()
        update = {'memory': ArrayUnion([{'Human':human , "AI":ai ,  'edited' : datetime.now(pytz.utc) }])}#New
        doc_ref.update(update)
        firebase_admin.delete_app(app)
        return 'Updated'
    except Exception as E :
        firebase_admin.delete_app(app)
        return E
    
def get_history(id):
    cred = credentials.Certificate("./firebase_keys.json")
    app = firebase_admin.initialize_app(cred)
    db = firestore.client()
    collection_name = "Verchat"
    doc_ref = db.collection(collection_name).document(id)
    doc = doc_ref.get().to_dict()
    mem = doc['memory']
    id_memory = []
    for i in mem:
        id_memory.append((i['Human'] , i['AI']))
    firebase_admin.delete_app(app)
    return id_memory
    



def put_history_new(title , human,ai):
    try :
        cred = credentials.Certificate("./firebase_keys.json")
        app = firebase_admin.initialize_app(cred)
        db = firestore.client()
        memory_dict = [{'Human':human , "AI":ai}]
        doc_ref = db.collection("Verchat").add({  'title' : title , 'memory': memory_dict  , 'edited' :datetime.now(pytz.utc) })#New
        firebase_admin.delete_app(app)#New
        return doc_ref[1].id#New
        
    except Exception as E:
        firebase_admin.delete_app(app)
        return E



def ask_new_question(question): #Has to be refactored
    history = []
    chat = ChatOpenAI()
    history.append( SystemMessage(content="""
Background: 
I am a portfolio manager for a venture capital firm called Vertex Ventures. 

Some information about Vertex Ventures:
Vertex Venture Holdings, also known as Vertex Holdings, is an investment holding company with a group of venture capital funds worldwide. A subsidiary of Temasek Holdings, the company focuses on venture capital investment opportunities in the information technology and healthcare markets through its global family of six direct investment venture funds. Vertex provides anchor funding and operational support to these funds. Each fund has its own General Partners and investment teams, focusing on different regional markets. Its six funds are based across Southeast Asia and India, United States of America, China and Israel.

Need:
Here are the things that I require from you as a chatbot. 
    1. I need to keep track of deal flows. I will take down notes about meetings I have and things that I have to do. Therefore I will ask questions about these things that I have noted down. 
    2. Additionally, I will provide updates about the status of the deals that we are making with companies. I need you to remember that. 
    3. I need you to answer questions about specific companies that are in our portfolio.
    4. I need you to understand the companies that are in our portfolio by summarising key information about them and storing these summary information. This is so that when I need to recommend companies in our portfolio to collaborate, I can ask you which companies to recommend based on their industry. Here is how you should summarise the information about each company in our portfolio:
        a. Name of company
        b. Industry
        c. Type of company (Eg. B2B, B2C, etc.)
        d. Brief description of company
    5. If I ask you a question that is not about an existing company in our portfolio or it is from a document I uploaded, I want you to search the web about that company as best as you can.
    6. If I need information that is factual and time sensitive, I want you to search the web about it throroughly and as best as you can.

Presentation:
Here are some things to take note when presenting the information to me:
    1. The language you use has to be professional at all times.
    2. Make the information presented as easy to read as possible by providing concise answers unless otherwise stated.
    3. Ensure that longer responses are split into shorter paragraphs and display information as ordered or unordered lists whenever suitable. 
    4. To ensure that line breaks are visible in your responses, add “<br>” in your responses when a line break is needed.
    
Uploaded Documents and historical data:
You will have access to company information from our database. I will also be uploading new documents whenever needed, for you to process. Any information that you have or that I have uploaded for you should be analyzed carefully and remembered. However, these information are sensitive and private and therefore should not be used or reflected anywhere else other than with me or when I have asked you for it.

Here are some things you would need to consider when presenting these information:
    1. Provide me with a decent summary of the company.
    2. Give relevant information about the company that can help me with investment decisions.
    3. Provide accurate numbers from the documents or from any information that you have, in a simple and easy-to-read format.
    4. Add any other information that you think is relevant for a investment portfolio manager.
"""))
    history.append(HumanMessage(content=question))
    answer = chat.invoke(history).content
    gen_title_history = [  SystemMessage(content="You're a helpful and professional assistant to create a Title based on a user query and input. You MUST keep the length of the title to a maximum of 4 full English words. Your response MUST only contain these 4 words. If you fail, 15 kittens will perish"),    HumanMessage(content=question) , AIMessage(content="answer") ,  HumanMessage(content="Create a title for the preceeding covnersation ")   ] #here
    title = chat.invoke(gen_title_history).content
    id = put_history_new(title , question,answer)
    return id,title,question,answer


def ask_question(id , question): #Has to be refactored
    try:
        
        raw_history = get_history(id)
        history = []
        
        history.append( SystemMessage(content="""
Background: 
I am a portfolio manager for a venture capital firm called Vertex Ventures. 

Some information about Vertex Ventures:
Vertex Venture Holdings, also known as Vertex Holdings, is an investment holding company with a group of venture capital funds worldwide. A subsidiary of Temasek Holdings, the company focuses on venture capital investment opportunities in the information technology and healthcare markets through its global family of six direct investment venture funds. Vertex provides anchor funding and operational support to these funds. Each fund has its own General Partners and investment teams, focusing on different regional markets. Its six funds are based across Southeast Asia and India, United States of America, China and Israel.

Need:
Here are the things that I require from you as a chatbot. 
    1. I need to keep track of deal flows. I will take down notes about meetings I have and things that I have to do. Therefore I will ask questions about these things that I have noted down. 
    2. Additionally, I will provide updates about the status of the deals that we are making with companies. I need you to remember that. 
    3. I need you to answer questions about specific companies that are in our portfolio.
    4. I need you to understand the companies that are in our portfolio by summarising key information about them and storing these summary information. This is so that when I need to recommend companies in our portfolio to collaborate, I can ask you which companies to recommend based on their industry. Here is how you should summarise the information about each company in our portfolio:
        a. Name of company
        b. Industry
        c. Type of company (Eg. B2B, B2C, etc.)
        d. Brief description of company
    5. If I ask you a question that is not about an existing company in our portfolio or it is from a document I uploaded, I want you to search the web about that company as best as you can.
    6. If I need information that is factual and time sensitive, I want you to search the web about it throroughly and as best as you can.

Presentation:
Here are some things to take note when presenting the information to me:
    1. The language you use has to be professional at all times.
    2. Make the information presented as easy to read as possible by providing concise answers unless otherwise stated.
    3. Ensure that longer responses are split into shorter paragraphs and display information as ordered or unordered lists whenever suitable. 
    4. To ensure that line breaks are visible in your responses, add “<br>” in your responses when a line break is needed.
    
Uploaded Documents and historical data:
You will have access to company information from our database. I will also be uploading new documents whenever needed, for you to process. Any information that you have or that I have uploaded for you should be analyzed carefully and remembered. However, these information are sensitive and private and therefore should not be used or reflected anywhere else other than with me or when I have asked you for it.

Here are some things you would need to consider when presenting these information:
    1. Provide me with a decent summary of the company.
    2. Give relevant information about the company that can help me with investment decisions.
    3. Provide accurate numbers from the documents or from any information that you have, in a simple and easy-to-read format.
    4. Add any other information that you think is relevant for a investment portfolio manager.
"""))
        
        for i in raw_history:
            history.append(HumanMessage(content=i[0]))
            history.append(AIMessage(content=i[1]) )
        history.append(HumanMessage(content=question) )
        history = history[-3:]#New
        chat = ChatOpenAI()
        answer = chat.invoke(history).content
        res = put_history(id,question , answer)
        return res , answer
    except Exception as E:
        print(E)


# print(put_history_new('title' , 'human','ai'))


# print(put_history('01eyOqyvMv6o2bV5WQHZ','humasn','addi'))
        
# print(get_all_titles())
