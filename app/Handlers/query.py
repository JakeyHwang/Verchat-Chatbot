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

load_dotenv()

os.environ["OPENAI_API_KEY"] = os.getenv("openai_api_key")


def get_all_titles():#Provides all Titles and ID
    try:
        cred = credentials.Certificate("../firebase_keys.json")
        app = firebase_admin.initialize_app(credential=cred)
        db = firestore.client()
        documents_data = []
        collection_name = "Verchat"
        collection_ref = db.collection(collection_name)
        docs = collection_ref.stream()
        for doc in docs:
            doc_id = doc.id
            doc = doc.to_dict()
            documents_data.append((doc_id , doc['title']))
        firebase_admin.delete_app(app)
        return documents_data
    except Exception as E:
        print(E)
        firebase_admin.delete_app(app)
        return []
    




def put_history(id,human,ai):
    try :
        cred = credentials.Certificate("../firebase_keys.json")
        app = firebase_admin.initialize_app(credential=cred)
        db = firestore.client()
        doc_ref = db.collection("Verchat").document(id)
        doc = doc_ref.get()
        doc = doc.to_dict()
        update = {'memory': ArrayUnion([{'Human':human , "AI":ai}])}
        doc_ref.update(update)
        firebase_admin.delete_app(app)
        return 'Updated'
    except Exception as E :
        firebase_admin.delete_app(app)
        return E
    
def get_history(id):
    cred = credentials.Certificate("../firebase_keys.json")
    app = firebase_admin.initialize_app(credential=cred)
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
        cred = credentials.Certificate("../firebase_keys.json")
        app = firebase_admin.initialize_app(credential=cred)
        db = firestore.client()
        memory_dict = [{'Human':human , "AI":ai}]
        doc_ref = db.collection("Verchat").add({  'title' : title , 'memory': memory_dict   })
        return doc_ref.id
        # firebase_admin.delete_app(app)
    except Exception as E:
        firebase_admin.delete_app(app)
        return E



def ask_new_question(question): #Has to be refactored
    history = []
    chat = ChatOpenAI(api_key=os.environ["OPENAI_API_KEY"])
    history.append( SystemMessage(content="You are a professional assitant that can answer any questions based on the knowledge you have. Answer any question asked to you in a proffessional and succint way"))
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
        
        history.append( SystemMessage(content="You are a professional assitant that can answer any questions based on the knowledge you have. Answer any question asked to you in a proffessional and succint way"))
        
        for i in raw_history:
            history.append(HumanMessage(content=i[0]))
            history.append(AIMessage(content=i[1]) )
        history.append(HumanMessage(content=question) )
        
        chat = ChatOpenAI(api_key=os.environ["OPENAI_API_KEY"])
        answer = chat.invoke(history).content
        put_history(id,question , answer)
        return id , question , answer
    except Exception as E:
        print(E)


