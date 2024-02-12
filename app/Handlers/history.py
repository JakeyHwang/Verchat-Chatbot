import firebase_admin
from firebase_admin import credentials , firestore
import os
from google.cloud.firestore import ArrayUnion


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
            documents_data.append((doc_id , doc['title']))
        return documents_data
    except Exception as E:
        print(E)
        return []
    




def put_history(id,human,ai):
    try :
        cred = credentials.Certificate("./firebase_keys.json")
        app = firebase_admin.initialize_app(cred)
        db = firestore.client()
        doc_ref = db.collection("Verchat").document(id)
        doc = doc_ref.get()
        doc = doc.to_dict()
        update = {'memory': ArrayUnion([{'Human':human , "AI":ai}])}
        doc_ref.update(update)
        return 'Updated'
    except Exception as E :
        return E
    



def put_history_new(title , human,ai):
    try :
        cred = credentials.Certificate("./firebase_keys.json")
        app = firebase_admin.initialize_app(cred)
        db = firestore.client()
        memory_dict = [{'Human':human , "AI":ai}]
        doc_ref = db.collection("Verchat").add({  'title' : title , 'memory': memory_dict   })
        return doc_ref.id
    except Exception as E:
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
    return id_memory


print(get_history('UserID'))



























# new_doc_ref = db.collection(collection_name).document()
# data = {
#     "Title":'AI Generated Title',
#     'memory':{
#         'Human':'Input Human',
#         'AI': 'Answer AI'
#     }
# }
# firebase_admin.delete_app(app)